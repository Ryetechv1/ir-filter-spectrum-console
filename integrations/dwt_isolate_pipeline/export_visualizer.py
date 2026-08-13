import os, cv2
import matplotlib.pyplot as plt
import numpy as np

try:
    import torch
except ModuleNotFoundError:
    torch = None

def tensor_to_cv2_image(tensor):
    if isinstance(tensor, np.ndarray):
        img = tensor
        if img.ndim == 3 and img.shape[0] in (1, 3):
            img = np.transpose(img, (1, 2, 0))
        return cv2.cvtColor((img * 255.0).clip(0, 255).astype('uint8'), cv2.COLOR_RGB2BGR)
    img = tensor.detach().cpu().squeeze(0).permute(1, 2, 0).numpy()
    return cv2.cvtColor((img * 255.0).clip(0, 255).astype('uint8'), cv2.COLOR_RGB2BGR)

def export_and_plot_results(carrier_tensor, steg_tensor, hidden_noise_tensor, save_dir="/app/exports"):
    os.makedirs(save_dir, exist_ok=True)
    carrier_bgr, steg_bgr = tensor_to_cv2_image(carrier_tensor), tensor_to_cv2_image(steg_tensor)
    if isinstance(hidden_noise_tensor, np.ndarray):
        noise_disp = hidden_noise_tensor
        noise_bgr = tensor_to_cv2_image(noise_disp) if noise_disp.shape[0] == 3 else cv2.cvtColor((noise_disp * 255.0).clip(0, 255).astype('uint8'), cv2.COLOR_GRAY2BGR)
    else:
        noise_disp = hidden_noise_tensor.detach().cpu().squeeze(0)
        noise_bgr = tensor_to_cv2_image(noise_disp) if noise_disp.shape[0] == 3 else cv2.cvtColor((noise_disp.numpy() * 255.0).clip(0, 255).astype('uint8'), cv2.COLOR_GRAY2BGR)

    cv2.imwrite(os.path.join(save_dir, "export_original_carrier.png"), carrier_bgr)
    cv2.imwrite(os.path.join(save_dir, "export_steg_canvas.png"), steg_bgr)
    cv2.imwrite(os.path.join(save_dir, "export_extracted_hidden_noise.png"), noise_bgr)

    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    for ax, img, title in zip(axes, [carrier_bgr, steg_bgr, noise_bgr], ["Carrier", "Stego Canvas", "Hidden Noise"]):
        ax.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        ax.set_title(title)
        ax.axis('off')
    plt.tight_layout()
    plt.savefig(os.path.join(save_dir, "comparison_matrix_plot.png"), dpi=300)
    plt.close()
    print("Export matrix saved successfully.")

def demo_tensor():
    if torch is not None:
        return torch.rand(1, 3, 128, 128)
    return np.random.default_rng(20260812).random((3, 128, 128), dtype=np.float32)

if __name__ == "__main__":
    export_and_plot_results(demo_tensor(), demo_tensor(), demo_tensor(), save_dir="exports")
