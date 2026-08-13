import torch
import torch.nn as nn

class MultiHeadNoiseLoss(nn.Module):
    def __init__(self, w_img=1.0, w_dig=1.2, w_lum=0.8, w_chrom=1.5):
        super(MultiHeadNoiseLoss, self).__init__()
        self.mse = nn.MSELoss()
        self.w_img = w_img
        self.w_dig = w_dig
        self.w_lum = w_lum
        self.w_chrom = w_chrom

    def forward(self, preds, targets):
        loss_img = self.mse(preds['image_noise'], targets['image_noise'])
        loss_dig = self.mse(preds['digital_noise'], targets['digital_noise'])
        loss_lum = self.mse(preds['luminance_noise'], targets['luminance_noise'])
        loss_chrom = self.mse(preds['chrominance_noise'], targets['chrominance_noise'])

        total_loss = (
            self.w_img * loss_img +
            self.w_dig * loss_dig +
            self.w_lum * loss_lum +
            self.w_chrom * loss_chrom
        )
        return total_loss, {
            'loss_img': loss_img.item(),
            'loss_dig': loss_dig.item(),
            'loss_lum': loss_lum.item(),
            'loss_chrom': loss_chrom.item()
        }
