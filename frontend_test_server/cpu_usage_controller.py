import psutil
from threading import Thread


class CPUUsageController:
    def __init__(self):
        self.__current_usage = 0
        controller_thread = Thread(target=self.__controller_mainloop)
        controller_thread.start()

    def get_current_cpu_usage(self):
        return self.__current_usage

    def __controller_mainloop(self):
        while True:
            self.__current_usage = psutil.cpu_percent(interval=1)

cpu_usage_controller = CPUUsageController()
