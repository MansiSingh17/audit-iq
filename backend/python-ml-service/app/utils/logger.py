import logging
import colorlog
from app.config import Config

def setup_logger():
    """Setup application logger"""
    handler = colorlog.StreamHandler()
    handler.setFormatter(colorlog.ColoredFormatter(
        '%(log_color)s%(levelname)-8s%(reset)s %(blue)s%(message)s',
        datefmt=None,
        reset=True,
        log_colors={
            'DEBUG': 'cyan',
            'INFO': 'green',
            'WARNING': 'yellow',
            'ERROR': 'red',
            'CRITICAL': 'red,bg_white',
        }
    ))
    
    logger = colorlog.getLogger()
    logger.addHandler(handler)
    logger.setLevel(logging.DEBUG if Config.DEBUG else logging.INFO)
    
    return logger

def get_logger(name):
    """Get logger instance"""
    return logging.getLogger(name)