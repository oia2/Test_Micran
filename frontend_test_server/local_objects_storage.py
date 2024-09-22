from typing import Union
from datetime import datetime


class LocalObjectsStorage:
    def __init__(self):
        self.__local_storage: dict[int, dict] = {
            1: {
                "object_name": "ems1 starter",
                "object_type": "EMS",
                "object_description": "starter obj 1"
            },
            2: {
                "object_name": "NN starter",
                "object_type": "Network node",
                "object_description": "starter obj 2"
            },
            3: {
                "object_name": "DE starter",
                "object_type": "Data Element SNMP",
                "object_description": "starter obj 3"
            }
        }
        self.__last_object_id = len(self.__local_storage.keys())

    def get_objects(self) -> list:
        objects_list:list = list()

        for object_id in self.__local_storage:
            object_dict = self.__local_storage[object_id]
            object_dict["object_id"] = object_id
            objects_list.append(object_dict)

        return objects_list

    def insert_object(self, object_name: str, object_type: str, object_description: str):
        if object_type not in ("EMS", "Network node", "Data Element SNMP"):
            return {
                "operation": "insert",
                "errors": "Incorrect object type"
            }

        self.__last_object_id += 1

        object_instance = {
            "object_name": object_name,
            "object_type": object_type,
            "object_description": object_description
        }

        self.__local_storage[self.__last_object_id] = object_instance

        return {
                "operation": "insert",
                "object_id": self.__last_object_id,
                "object_instance": object_instance, 
                "timestamp": datetime.now().isoformat(),
                "errors": ""
        } 

    def delete_object(self, object_id: int) -> dict:
        if object_id in self.__local_storage.keys():
            removed_object = self.__local_storage.pop(object_id)

            return {
                "operation": "delete",
                "object_id": object_id,
                "object_instance": removed_object, 
                "timestamp": datetime.now().isoformat(),
                "errors": ""
            }

        return {
            "operation": "delete",
            "errors": "Invalid object id"
        }

    def update_object(
        self, 
        object_id: int, 
        object_name: Union[str, None] = None, 
        object_type: Union[str, None] = None, 
        object_description: Union[str, None] = None
    ):
        updated_param = ""

        if object_id not in self.__local_storage.keys():
            return {
                "operation": "update",
                "errors": "Invalid object id"
            }
        
        object_instance = self.__local_storage[object_id]

        if object_type is not None:
            if  object_type not in ("EMS", "Network node", "Data Element SNMP"):
                return {
                    "operation": "update",
                    "errors": "Incorrect object type"
                }
            else:
                object_instance["object_type"] = object_type
                updated_param = "object_type"


        elif object_name is not None:
            object_instance["object_name"] = object_name
            updated_param = "object_name"

        elif object_description is not None:
            object_instance["object_description"] = object_description
            updated_param = "object_description"

        else:
            return {
                    "operation": "update",
                    "errors": "Nothing to update"
                }
    
        self.__local_storage[object_id] = object_instance   

        return {
                    "operation": "update",
                    "updated_param": updated_param,
                    "errors": ""
                } 


local_objects_storage = LocalObjectsStorage()
