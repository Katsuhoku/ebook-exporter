import pyautogui
from PIL import Image
from time import sleep
import PIL.ImageOps, PIL.ImageEnhance
import numpy as np
from os import listdir
from os.path import isdir, isfile, join
import eel
import tkinter as tk
from tkinter import filedialog

WINDOW_WIDTH, WINDOW_HEIGHT = 600,800
screenWidth, screenHeight = pyautogui.size()

eel.init('web')

def close_callback(route, websockets):
    if not websockets:
        exit()
        
@eel.expose
def log(msg: str):
    print(msg)
    
@eel.expose
def select_folder():
    root = tk.Tk()
    root.withdraw()
    path = filedialog.askdirectory()
    return path

@eel.expose
def capture(pages: int, folder: str):
    pyautogui.moveTo(screenWidth / 2, screenHeight / 2)
    pyautogui.click()
    sleep(1)
    pyautogui.click()
    pyautogui.moveTo(100,600)
    for i in range(pages):
        left = int(screenWidth * 58/200)
        top = 0
        right = int(screenWidth * 84/200)
        bottom = screenHeight

        ss = pyautogui.screenshot(region=(left, top, right, bottom))
        num = ''
        if i < 100: num += '0'
        if i < 10: num += '0'
        ss.save(f'{folder}/{num + str(i)}.png')

        sleep(1)
        pyautogui.click()
        
    return 1

@eel.expose
def export_pdf(folder: str):
    raw = [join(folder,f) for f in listdir(folder) if isfile(join(folder, f)) and f.split('.')[-1].lower() == 'png']
    image = Image.open(raw[1])
    rgb = image.convert('RGB')
    imglist = []
    for img in raw[2:]:
        imglist.append(Image.open(img).convert('RGB'))
    
    outfn = f'{folder}/book.pdf'
    rgb.save(outfn, save_all=True, append_images=imglist)
    return 2

eel.start('index.html', size=(WINDOW_WIDTH, WINDOW_HEIGHT), close_callback=close_callback)