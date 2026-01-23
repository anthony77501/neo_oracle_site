
#*****************************************************************************************************************************************#

# import os
# import base64
# from pathlib import Path

# import cv2
# import numpy as np
# from fastapi import FastAPI, UploadFile, File, Form, Request
# from fastapi.responses import HTMLResponse, JSONResponse
# from fastapi.staticfiles import StaticFiles
# from fastapi.templating import Jinja2Templates

# from app.inference.detector import YoloDetector
# from app.inference.classifier import CornMaturityClassifier  # <- rename your class if you want (see note below)
# from app.inference.pipeline import run_pipeline

# from fastapi.middleware.cors import CORSMiddleware



# APP_DIR = Path(__file__).resolve().parent
# MODEL_DIR = APP_DIR / "model"

# DETECTOR_PATH = str(MODEL_DIR / "corn_detector.pt")  # file name can stay, UI says "maize"
# CLASSIFIER_PATH = str(MODEL_DIR / "cls_maturity_mobilenetv3_cls3_1.pth")

# app = FastAPI(title="Maize Cob Detection and Maturity Classification")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:8080",
#         "http://127.0.0.1:8080",
#         "http://localhost:5173",
#         "http://127.0.0.1:5173",
#         "http://localhost:5174",
#         "http://127.0.0.1:5174",
#         "http://localhost:5000",
#         "http://127.0.0.1:5000",
#     ],
#     allow_credentials=False,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )



# app.mount("/static", StaticFiles(directory=str(APP_DIR / "static")), name="static")
# templates = Jinja2Templates(directory=str(APP_DIR / "templates"))

# # ---- Load models once (startup)
# DEVICE_DET = os.getenv("DET_DEVICE", "0")    # "0" or "cpu"
# DEVICE_CLS = os.getenv("CLS_DEVICE", "cpu")  # classifier can be cpu

# detector = YoloDetector(DETECTOR_PATH, device=DEVICE_DET)
# classifier = CornMaturityClassifier(CLASSIFIER_PATH, device=DEVICE_CLS)

# @app.get("/health")
# def health():
#     return {
#         "ok": True,
#         "detector": detector.meta,
#         "classifier": classifier.meta,
#         "classes": classifier.meta.get("classes", ["ripe", "unripe"]),
#     }

# @app.get("/", response_class=HTMLResponse)
# def index(request: Request):
#     return templates.TemplateResponse("index.html", {"request": request})

# def _bgr_to_data_url_jpeg(bgr: np.ndarray, quality: int = 90) -> str:
#     encode_params = [int(cv2.IMWRITE_JPEG_QUALITY), int(quality)]
#     ok, buf = cv2.imencode(".jpg", bgr, encode_params)
#     if not ok:
#         raise ValueError("Failed to encode annotated image.")
#     b64 = base64.b64encode(buf.tobytes()).decode("utf-8")
#     return f"data:image/jpeg;base64,{b64}"

# @app.post("/predict")
# async def predict(
#     file: UploadFile = File(...),
#     detection_confidence_threshold: float = Form(0.20),
#     overlap_suppression_threshold: float = Form(0.45),  # IoU for NMS
#     ripeness_decision_threshold: float = Form(0.50),
# ):
#     try:
#         data = await file.read()
#         img_array = np.frombuffer(data, dtype=np.uint8)
#         bgr = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
#         if bgr is None:
#             return JSONResponse(
#                 {"ok": False, "error": "Cannot decode image. Please upload a valid JPG/PNG file."},
#                 status_code=400,
#             )

#         # Run pipeline (internal params can stay short; external names are friendly)
#         out_img, rows = run_pipeline(
#             detector,
#             classifier,
#             bgr,
#             det_conf=float(detection_confidence_threshold),
#             det_iou=float(overlap_suppression_threshold),
#             cls_threshold=float(ripeness_decision_threshold),
#         )

#         # Convert annotated image to a browser-displayable data URL (no disk write)
#         annotated_data_url = _bgr_to_data_url_jpeg(out_img, quality=90)

#         # Convert internal row keys to farmer-friendly keys
#         # Expected row format coming from your pipeline: {
#         #   "det_conf": ..., "ripe_prob": ..., "label": ..., ...
#         # }
#         results = []
#         for i, r in enumerate(rows, start=1):
#             det_conf = float(r.get("det_conf", 0.0))
#             ripe_prob = float(r.get("ripe_prob", 0.0))
#             label = str(r.get("label", ""))  # "ripe"/"unripe"

#             results.append({
#                 "cob_number": i,
#                 "detection_confidence": det_conf,
#                 "ripeness_probability": ripe_prob,
#                 "maturity_label": label,  # keep exact label from training
#             })

#         return {
#             "ok": True,
#             "cobs_detected": len(results),
#             "results": results,
#             "annotated_image_data_url": annotated_data_url,
#         }

#     except Exception as e:
#         return JSONResponse({"ok": False, "error": repr(e)}, status_code=500)

# import os
# import base64
# from pathlib import Path

# import cv2
# import numpy as np
# from fastapi import FastAPI, UploadFile, File, Form
# from fastapi.responses import JSONResponse
# from fastapi.routing import APIRouter
# from fastapi.staticfiles import StaticFiles

# from app.inference.detector import YoloDetector
# from app.inference.classifier import CornMaturityClassifier
# from app.inference.pipeline import run_pipeline

# APP_DIR = Path(__file__).resolve().parent

# # Chemins ABSOLUS (comme tu veux)
# DETECTOR_PATH = "/home/anthony/corn_detection_web_app/web_app_repo/app/model/detection/best.pt"
# CLASSIFIER_PATH = "/home/anthony/corn_detection_web_app/web_app_repo/app/model/classification/best.pt"

# if not Path(DETECTOR_PATH).exists():
#     raise FileNotFoundError(f"Detector model not found: {DETECTOR_PATH}")

# if not Path(CLASSIFIER_PATH).exists():
#     raise FileNotFoundError(f"Classifier model not found: {CLASSIFIER_PATH}")

# app = FastAPI(title="Maize Cob Detection and Maturity Classification")

# # Modèles (chargés une seule fois)
# DEVICE_DET = os.getenv("DET_DEVICE", "0")    # "0" ou "cpu"
# DEVICE_CLS = os.getenv("CLS_DEVICE", "0")    # "0" ou "cpu" (tu veux GPU, donc "0")

# detector = YoloDetector(DETECTOR_PATH, device=DEVICE_DET)
# classifier = CornMaturityClassifier(CLASSIFIER_PATH, device=DEVICE_CLS)

# api = APIRouter(prefix="/api")

# @api.get("/health")
# def health():
#     return {
#         "ok": True,
#         "detector": detector.meta,
#         "classifier": classifier.meta,
#         "classes": classifier.meta.get("classes", ["ripe", "unripe"]),
#     }

# def _bgr_to_data_url_jpeg(bgr: np.ndarray, quality: int = 90) -> str:
#     ok, buf = cv2.imencode(".jpg", bgr, [int(cv2.IMWRITE_JPEG_QUALITY), int(quality)])
#     if not ok:
#         raise ValueError("Failed to encode annotated image.")
#     b64 = base64.b64encode(buf.tobytes()).decode("utf-8")
#     return f"data:image/jpeg;base64,{b64}"

# @api.post("/predict")
# async def predict(
#     file: UploadFile = File(...),
#     detection_confidence_threshold: float = Form(0.20),
#     overlap_suppression_threshold: float = Form(0.45),
#     ripeness_decision_threshold: float = Form(0.50),
# ):
#     try:
#         data = await file.read()
#         img_array = np.frombuffer(data, dtype=np.uint8)
#         bgr = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

#         if bgr is None:
#             return JSONResponse(
#                 {"ok": False, "error": "Cannot decode image. Please upload a valid JPG/PNG file."},
#                 status_code=400,
#             )

#         out_img, rows = run_pipeline(
#             detector,
#             classifier,
#             bgr,
#             det_conf=float(detection_confidence_threshold),
#             det_iou=float(overlap_suppression_threshold),
#             cls_threshold=float(ripeness_decision_threshold),
#         )

#         annotated_data_url = _bgr_to_data_url_jpeg(out_img, quality=90)

#         results = []
#         for i, r in enumerate(rows, start=1):
#             results.append({
#                 "cob_number": i,
#                 "detection_confidence": float(r.get("det_conf", 0.0)),
#                 "ripeness_probability": float(r.get("ripe_prob", 0.0)),
#                 "maturity_label": str(r.get("label", "")),
#             })

#         return {
#             "ok": True,
#             "cobs_detected": len(results),
#             "results": results,
#             "annotated_image_data_url": annotated_data_url,
#         }

#     except Exception as e:
#         return JSONResponse({"ok": False, "error": repr(e)}, status_code=500)

# app.include_router(api)

# # Front-end statique à la racine (index.html, styles.css, app.js dans app/static/)
# FRONT_DIR = APP_DIR / "static"
# app.mount("/", StaticFiles(directory=str(FRONT_DIR), html=True), name="frontend")

import os
import time
import base64
import traceback
import hashlib
from pathlib import Path

import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse

from app.inference.pipeline import run_pipeline
from app.inference.detector import YoloDetector
from app.inference.classifier import CornMaturityClassifier

APP_DIR = Path(__file__).resolve().parent
MODEL_DIR = APP_DIR / "model"

# Chemin vers le site (ton portfolio) à servir sur la même origine que l’inférence
FRONTEND_DIR = os.getenv("NEO_ORACLE_FRONTEND_DIR", "").strip()
FRONTEND_DIR_PATH = Path(FRONTEND_DIR).expanduser().resolve() if FRONTEND_DIR else None

# Paramètres (optionnels) via variables d’environnement
DET_DEVICE = (os.getenv("DET_DEVICE", "cpu") or "cpu").strip()
CLS_DEVICE = (os.getenv("CLS_DEVICE", "cpu") or "cpu").strip()

try:
    DET_CONF = float(os.getenv("DET_CONF", "0.25"))
except ValueError:
    DET_CONF = 0.25

try:
    DET_IOU = float(os.getenv("DET_IOU", "0.45"))
except ValueError:
    DET_IOU = 0.45

try:
    CLS_THRESHOLD = float(os.getenv("CLS_THRESHOLD", "0.50"))
except ValueError:
    CLS_THRESHOLD = 0.50

app = FastAPI(title="Corn Detection + Maturity Classification")

detector: YoloDetector | None = None
classifier: CornMaturityClassifier | None = None


@app.on_event("startup")
def load_models() -> None:
    global detector, classifier

    det_weights = MODEL_DIR / "corn_detector.pt"
    cls_weights = MODEL_DIR / "cls_maturity_mobilenetv3_cls3_1.pth"

    if not det_weights.exists():
        raise RuntimeError(f"Fichier modèle détection introuvable: {det_weights}")
    if not cls_weights.exists():
        raise RuntimeError(f"Fichier modèle classification introuvable: {cls_weights}")

    detector = YoloDetector(weights_path=str(det_weights), device=DET_DEVICE)
    classifier = CornMaturityClassifier(weights_path=str(cls_weights), device=CLS_DEVICE)


@app.get("/health")
@app.get("/api/health")
def health():
    return {
    "ok": True,
    "status": "ok",
    "detector_loaded": detector is not None,
    "classifier_loaded": classifier is not None,
}



@app.post("/predict")
@app.post("/api/predict")
async def predict(
    file: UploadFile = File(...),
    detection_confidence_threshold: float = Form(0.20),
    overlap_suppression_threshold: float = Form(0.30),
    ripeness_decision_threshold: float = Form(0.20),
):
    t0 = time.time()
    try:
        content = await file.read()
        sha1 = hashlib.sha1(content).hexdigest()

        # Decode image
        np_img = np.frombuffer(content, np.uint8)
        bgr_img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        if bgr_img is None:
            return JSONResponse({"ok": False, "error": "Image decode failed"}, status_code=400)

        # Inference
        out_img, raw_results = run_pipeline(
        detector=detector,
        classifier=classifier,
        bgr_img=bgr_img,
        det_conf=float(detection_confidence_threshold),
        det_iou=float(overlap_suppression_threshold),
        cls_threshold=float(ripeness_decision_threshold),
    )


        # Encode output as JPEG
        ok, jpg = cv2.imencode(".jpg", out_img)
        if not ok:
            return JSONResponse({"ok": False, "error": "Output image encode failed"}, status_code=500)

        b64 = base64.b64encode(jpg.tobytes()).decode("ascii")
        annotated_data_url = f"data:image/jpeg;base64,{b64}"

        # Normaliser les résultats vers le format attendu par le frontend
        results = []
        for r in (raw_results or []):
            # Compatible avec plusieurs formats possibles
            # (pipeline qui renvoie dicts avec keys ear_id/det_conf/ripe_prob/label)
            cob_number = r.get("cob_number", r.get("ear_id", None))
            det_conf = r.get("detection_confidence", r.get("det_conf", None))
            ripe_p = r.get("ripeness_probability", r.get("ripe_prob", None))
            label = r.get("maturity_label", r.get("label", None))

            results.append({
                "cob_number": int(cob_number) if cob_number is not None else None,
                "detection_confidence": float(det_conf) if det_conf is not None else None,
                "ripeness_probability": float(ripe_p) if ripe_p is not None else None,
                "maturity_label": str(label) if label is not None else None,
            })

        elapsed = time.time() - t0

        return {
            "ok": True,
            "sha1": sha1,
            "elapsed_sec": round(elapsed, 4),
            "cobs_detected": len(results),
            "results": results,
            "annotated_image_data_url": annotated_data_url
        }

    except Exception as e:
        return JSONResponse(
            {"ok": False, "error": str(e), "trace": traceback.format_exc()},
            status_code=500
        )



@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    if FRONTEND_DIR_PATH:
        ico = FRONTEND_DIR_PATH / "assets" / "favicon_logo.ico"
        if ico.is_file():
            return FileResponse(ico)
    return JSONResponse({"error": "favicon introuvable"}, status_code=404)


@app.get("/{path:path}", include_in_schema=False)
def serve_frontend(path: str):
    if not FRONTEND_DIR_PATH or not FRONTEND_DIR_PATH.is_dir():
        return JSONResponse(
            {"error": "NEO_ORACLE_FRONTEND_DIR non défini ou invalide"},
            status_code=404,
        )

    if path == "" or path == "/":
        return FileResponse(FRONTEND_DIR_PATH / "index.html")

    candidate = (FRONTEND_DIR_PATH / path).resolve()

    # Protection simple contre la traversée de répertoires
    try:
        candidate.relative_to(FRONTEND_DIR_PATH)
    except ValueError:
        return JSONResponse({"error": "Chemin invalide"}, status_code=400)

    if candidate.is_file():
        return FileResponse(candidate)

    # Fallback navigation côté client
    return FileResponse(FRONTEND_DIR_PATH / "index.html")
