import random
from constants import INIT_EVENTS_COUNT
import time
from threading import Thread

class EventsController:
    def __init__(self):
        self.__events_list: list = []

        self.__events_templates: list = [
            {"event": "Subsystem with id {} fallen", "type": "critical"},
            {"event": "Node #{} fallen with non zero error", "type": "warning"},
            {"event": "Node #{} connected", "type": "info"},
            {"event": "Node #{} disconnected", "type": "info"}
        ]

        for i in range(INIT_EVENTS_COUNT):
            self.__add_random_event()

        

        events_loop = Thread(target=self.__events_adding_loop)
        events_loop.start()

    def __add_random_event(self):
        new_event = random.choice(self.__events_templates)

        new_event["event"] = new_event["event"].format(random.randint(1,1000))
        new_event["date"] = f"{random.randint(1,25)}-{random.randint(1,12)}-2024"
        new_event["time"] = f"{random.randint(0,23)}:{random.randint(0,59)}"

        self.__events_list.append(new_event)

    def get_events_list(self):
        return self.__events_list

    def __events_adding_loop(self):
        while True:
            time.sleep(10)
            self.__add_random_event()


events_controller = EventsController()