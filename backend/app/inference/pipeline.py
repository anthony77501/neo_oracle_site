import cv2
import numpy as np

def clip_box(x1, y1, x2, y2, w, h):
    x1 = max(0, min(int(x1), w-1))
    y1 = max(0, min(int(y1), h-1))
    x2 = max(0, min(int(x2), w-1))
    y2 = max(0, min(int(y2), h-1))
    if x2 <= x1: x2 = min(w-1, x1+1)
    if y2 <= y1: y2 = min(h-1, y1+1)
    return x1, y1, x2, y2

def run_pipeline(detector, classifier, bgr_img,
                 det_conf=0.20, det_iou=0.45, max_det=300,
                 cls_threshold=0.50):
    res = detector.predict(bgr_img, conf=det_conf, iou=det_iou, max_det=max_det)

    h, w = bgr_img.shape[:2]
    boxes = []
    if res.boxes is not None and len(res.boxes) > 0:
        for b in res.boxes:
            x1, y1, x2, y2 = b.xyxy[0].tolist()
            conf = float(b.conf[0].item())
            x1, y1, x2, y2 = clip_box(x1, y1, x2, y2, w, h)
            boxes.append((x1, y1, x2, y2, conf))

    # Mini-table results
    rows = []
    out_img = bgr_img.copy()

    for i, (x1, y1, x2, y2, detc) in enumerate(boxes, start=1):
        crop = bgr_img[y1:y2, x1:x2]
        probs = classifier.predict_probs(crop)
        ripe_p = float(probs["ripe"])
        unripe_p = float(probs["unripe"])
        label = "RIPE" if ripe_p >= cls_threshold else "UNRIPE"

        rows.append({
            "ear_id": i,
            "det_conf": round(detc, 3),
            "ripe_prob": round(ripe_p, 3),
            "unripe_prob": round(unripe_p, 3),
            "label": label,
            "box": [x1, y1, x2, y2],
        })

        # Draw
        cv2.rectangle(out_img, (x1, y1), (x2, y2), (255,255,255), 3)
        cv2.putText(out_img, f"#{i} {label} r={ripe_p:.2f} d={detc:.2f}",
                    (x1, max(0, y1-10)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 2)

    return out_img, rows

#*************************************************************************************************************************************************************************#
# import cv2
# import numpy as np

# def clip_box(x1, y1, x2, y2, w, h):
#     x1 = max(0, min(int(x1), w-1))
#     y1 = max(0, min(int(y1), h-1))
#     x2 = max(0, min(int(x2), w-1))
#     y2 = max(0, min(int(y2), h-1))
#     if x2 <= x1: x2 = min(w-1, x1+1)
#     if y2 <= y1: y2 = min(h-1, y1+1)
#     return x1, y1, x2, y2

# def run_pipeline(detector, classifier, bgr_img,
#                  det_conf=0.20, det_iou=0.45, max_det=300,
#                  cls_threshold=0.50):
#     res = detector.predict(bgr_img, conf=det_conf, iou=det_iou, max_det=max_det)

#     h, w = bgr_img.shape[:2]
#     boxes = []
#     if res.boxes is not None and len(res.boxes) > 0:
#         for b in res.boxes:
#             x1, y1, x2, y2 = b.xyxy[0].tolist()
#             conf = float(b.conf[0].item())
#             x1, y1, x2, y2 = clip_box(x1, y1, x2, y2, w, h)
#             boxes.append((x1, y1, x2, y2, conf))

#     rows = []
#     out_img = bgr_img.copy()

#     for i, (x1, y1, x2, y2, detc) in enumerate(boxes, start=1):
#         crop = bgr_img[y1:y2, x1:x2]
#         probs = classifier.predict_probs(crop)

#         ripe_p = float(probs.get("ripe", 0.0))
#         unripe_p = float(probs.get("unripe", 0.0))
#         label = "RIPE" if ripe_p >= cls_threshold else "UNRIPE"

#         rows.append({
#             "ear_id": i,
#             "det_conf": round(detc, 3),
#             "ripe_prob": round(ripe_p, 3),
#             "unripe_prob": round(unripe_p, 3),
#             "label": label,
#             "box": [x1, y1, x2, y2],
#         })

#         cv2.rectangle(out_img, (x1, y1), (x2, y2), (255,255,255), 3)
#         cv2.putText(out_img, f"#{i} {label} r={ripe_p:.2f} d={detc:.2f}",
#                     (x1, max(0, y1-10)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 2)

#     return out_img, rows
