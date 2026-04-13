from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter

# 要保留的字符
chars = "清华大学经济管理学院2026项目申报指南经济管理学院项目申报指南经管学院项目学院概况七大优势项目教育改革方向博士项目7个专业报考方向会计学理论经济学与应用经济学金融学领导力与组织管理创新创业与战略管理科学与工程市场营销综合考核"

font = TTFont("AlibabaPuHuiTi-2-85-Bold.ttf")
subsetter = Subsetter()
subsetter.populate(text=chars)
subsetter.subset(font)
font.save("subset-font.ttf")