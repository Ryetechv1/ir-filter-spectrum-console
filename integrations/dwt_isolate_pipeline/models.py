import torch
import torch.nn as nn
import torch.nn.functional as F
from pytorch_wavelets import DWTForward, DWTInverse

class AdaptiveDWTStegEncoder(nn.Module):
    def __init__(self, wave='haar'):
        super(AdaptiveDWTStegEncoder, self).__init__()
        self.dwt = DWTForward(J=1, wave=wave, mode='symmetric')
        self.idwt = DWTInverse(wave=wave)

    def _compute_quantization_mask(self, subband, kernel_size=5):
        mean = F.avg_pool2d(subband, kernel_size, stride=1, padding=kernel_size//2)
        mean_sq = F.avg_pool2d(subband**2, kernel_size, stride=1, padding=kernel_size//2)
        variance = torch.clamp(mean_sq - mean**2, min=1e-5)
        return torch.sigmoid(variance) * 0.15

    def forward(self, carrier_img, noise_clusters):
        Yl, Yh = self.dwt(carrier_img)
        lh, hl, hh = Yh[:, :, 0], Yh[:, :, 1], Yh[:, :, 2]

        mask_lh = self._compute_quantization_mask(lh)
        mask_hl = self._compute_quantization_mask(hl)
        mask_hh = self._compute_quantization_mask(hh)

        lh_mod = lh + (mask_lh * noise_clusters['luminance_noise'])
        hl_mod = hl + (mask_hl * noise_clusters['chrominance_noise'])
        hh_mod = hh + (mask_hh * noise_clusters['digital_noise'])

        Yh_modified = [torch.stack([lh_mod, hl_mod, hh_mod], dim=2)]
        return self.idwt((Yl, Yh_modified))

class FlexibleAdaptiveExtractor(nn.Module):
    def __init__(self, wave='haar'):
        super(FlexibleAdaptiveExtractor, self).__init__()
        self.dwt = DWTForward(J=1, wave=wave, mode='symmetric')
        self.idwt = DWTInverse(wave=wave)
        self.noise_reconstructor = nn.Sequential(
            nn.Conv2d(9, 32, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(32, 3, kernel_size=3, padding=1),
            nn.Tanh()
        )

    def forward(self, steg_img, extract_carrier=True):
        Yl, Yh = self.dwt(steg_img)
        lh, hl, hh = Yh[:, :, 0], Yh[:, :, 1], Yh[:, :, 2]
        if extract_carrier:
            return self.idwt((Yl, [torch.zeros_like(torch.stack([lh, hl, hh], dim=2))]))

        combined = torch.cat([lh, hl, hh], dim=1)
        return F.interpolate(self.noise_reconstructor(combined), scale_factor=2, mode='bilinear', align_corners=False)

class StegValidationEvaluator(nn.Module):
    def __init__(self, window_size=11):
        super(StegValidationEvaluator, self).__init__()
        self.window_size = window_size

    def _ssim(self, img1, img2):
        mu1, mu2 = F.avg_pool2d(img1, self.window_size, 1, self.window_size//2), F.avg_pool2d(img2, self.window_size, 1, self.window_size//2)
        sigma1_sq = F.avg_pool2d(img1**2, self.window_size, 1, self.window_size//2) - mu1**2
        sigma2_sq = F.avg_pool2d(img2**2, self.window_size, 1, self.window_size//2) - mu2**2
        sigma12 = F.avg_pool2d(img1 * img2, self.window_size, 1, self.window_size//2) - (mu1 * mu2)
        c1, c2 = 0.01**2, 0.03**2
        return (((2 * mu1 * mu2 + c1) * (2 * sigma12 + c2)) / ((mu1**2 + mu2**2 + c1) * (sigma1_sq + sigma2_sq + c2))).mean()

    def validate_pipeline(self, original_carrier, steg_output, extracted_hidden, target_hidden):
        fidelity = self._ssim(original_carrier, steg_output)
        extraction_loss = F.mse_loss(extracted_hidden, target_hidden)
        return {
            "steg_ssim_fidelity": fidelity.item(),
            "extraction_mse_error": extraction_loss.item(),
            "pipeline_passed": bool(fidelity.item() > 0.95 and extraction_loss.item() < 0.01)
        }
