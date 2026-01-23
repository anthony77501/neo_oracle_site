import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
import hashlib
from pathlib import Path

def sha256_file(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

class CornMaturityClassifier:
    """
    Classes ORDER: ["ripe", "unripe"] 
    """
    CLASSES = ["ripe", "unripe"]

    def __init__(self, weights_path: str, device: str = "cpu"):
        self.weights_path = Path(weights_path).resolve()
        if not self.weights_path.exists():
            raise FileNotFoundError(f"Classifier weights not found: {self.weights_path}")

        self.device = torch.device(device)
        self.model = models.mobilenet_v3_small(weights=None)
        in_f = self.model.classifier[-1].in_features
        self.model.classifier[-1] = nn.Linear(in_f, len(self.CLASSES))

        sd = torch.load(str(self.weights_path), map_location="cpu")
        self.model.load_state_dict(sd)
        self.model.to(self.device)
        self.model.eval()

        self.tf = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406],
                                 [0.229, 0.224, 0.225]),
        ])

        self.meta = {
            "path": str(self.weights_path),
            "size_mb": round(self.weights_path.stat().st_size / (1024 * 1024), 2),
            "sha256": sha256_file(self.weights_path),
            "device": str(self.device),
            "classes": self.CLASSES,
        }

    @torch.no_grad()
    def predict_probs(self, crop_bgr: np.ndarray):
        # BGR (OpenCV) -> RGB PIL
        rgb = crop_bgr[:, :, ::-1]
        img = Image.fromarray(rgb)
        x = self.tf(img).unsqueeze(0).to(self.device)

        logits = self.model(x)
        probs = torch.softmax(logits, dim=1)[0].detach().cpu().numpy().tolist()

        out = dict(zip(self.CLASSES, probs))
        return out

#************************************************************************************************************************************************************************************#
# # app/inference/classifier.py
# from pathlib import Path
# import hashlib
# import numpy as np
# from ultralytics import YOLO

# def sha256_file(p: Path) -> str:
#     h = hashlib.sha256()
#     with p.open("rb") as f:
#         for chunk in iter(lambda: f.read(1024 * 1024), b""):
#             h.update(chunk)
#     return h.hexdigest()

# class CornMaturityClassifier:
#     """
#     YOLO classification model (Ultralytics).
#     Expects classes like ["ripe", "unripe"] from the model metadata.
#     """
#     def __init__(self, weights_path: str, device: str = "0"):
#         self.weights_path = Path(weights_path).resolve()
#         if not self.weights_path.exists():
#             raise FileNotFoundError(f"Classifier weights not found: {self.weights_path}")

#         # Ultralytics device can be: "0", "cpu"
#         self.device = str(device)
#         self.model = YOLO(str(self.weights_path))

#         # classes from YOLO model
#         names = getattr(self.model.model, "names", None)
#         if isinstance(names, dict):
#             self.classes = [names[i] for i in range(len(names))]
#         elif isinstance(names, list):
#             self.classes = names
#         else:
#             self.classes = ["ripe", "unripe"]  # fallback

#         self.meta = {
#             "path": str(self.weights_path),
#             "size_mb": round(self.weights_path.stat().st_size / (1024 * 1024), 2),
#             "sha256": sha256_file(self.weights_path),
#             "device": self.device,
#             "classes": self.classes,
#             "backend": "ultralytics-yolo-cls",
#         }

#     def predict_probs(self, crop_bgr: np.ndarray):
#         """
#         Input: crop in BGR (OpenCV)
#         Output: dict {class_name: probability}
#         """
#         # Ultralytics accepts numpy arrays; it will handle BGR/RGB internally.
#         r = self.model.predict(source=crop_bgr, device=self.device, verbose=False)[0]

#         # r.probs is a Probs object with .data tensor
#         probs = r.probs.data.detach().cpu().numpy().tolist()

#         out = {}
#         for i, p in enumerate(probs):
#             name = self.classes[i] if i < len(self.classes) else str(i)
#             out[name] = float(p)
#         return out
