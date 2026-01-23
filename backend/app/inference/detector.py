from ultralytics import YOLO
import hashlib
from pathlib import Path

def sha256_file(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

class YoloDetector:
    def __init__(self, weights_path: str, device: str = "cpu"):
        self.weights_path = Path(weights_path).resolve()
        if not self.weights_path.exists():
            raise FileNotFoundError(f"YOLO weights not found: {self.weights_path}")

        self.model = YOLO(str(self.weights_path))
        self.device = device

        self.meta = {
            "path": str(self.weights_path),
            "size_mb": round(self.weights_path.stat().st_size / (1024 * 1024), 2),
            "sha256": sha256_file(self.weights_path),
            "device": str(device),
        }

    def predict(self, bgr_img, conf: float, iou: float, max_det: int):
        # Ultralytics accepte numpy BGR/RGB; on reste simple
        res = self.model.predict(
            source=bgr_img,
            conf=conf,
            iou=iou,
            max_det=max_det,
            verbose=False,
            device=self.device
        )[0]
        return res
