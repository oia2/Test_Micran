from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from models import UpdateObjectRequest
from cpu_usage_controller import cpu_usage_controller
from events_controller import events_controller
from local_objects_storage import local_objects_storage

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/current_cpu_usage")
def get_current_cpu_usage():
    return {
        "cpu_usage": cpu_usage_controller.get_current_cpu_usage()
    }
    
@app.get("/recent_events")
def get_recent_events():
    return {
        "events": events_controller.get_events_list()
    }

@app.get("/objects_list")
def get_objects_list():
    return {"objects": local_objects_storage.get_objects()}

@app.post("/manage_object")
def manage_object(data: UpdateObjectRequest):

    payload = data.data
    storage_operation_parametres = {"object_name", "object_type", "object_description"}

    match data.operation_type:
        case "insert":
            if not set(payload.keys()) == storage_operation_parametres:
                return {"errors": "fields in data does't match operation type"}

            return local_objects_storage.insert_object(
                **payload
            )

        case "update":
            if not payload or "object_id" not in payload:
                return {"errors": "fields in data does't match operation type"}
            
            return local_objects_storage.update_object(**payload)

        case "delete":

            if "object_id" not in payload.keys():
                return {"errors": "fields in data does't match operation type"}

            return local_objects_storage.delete_object(payload["object_id"])

        case _:
            return {"errors": "Unsupported operation type"}

if __name__ == "__main__":
    uvicorn.run("__main__:app", host="0.0.0.0", port=8000, reload=False)