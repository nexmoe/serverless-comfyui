printf "=========================================================\n"

# cd /opt/ComfyUI/custom_nodes
# git clone https://github.com/Fannovel16/comfyui_controlnet_aux/
pip config set global.index-url https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple

cd /opt/ComfyUI/custom_nodes/comfyui_controlnet_aux
pip install -r requirements.txt

cd /opt/ComfyUI/custom_nodes/ComfyUI-WD14-Tagger
pip install -r requirements.txt

printf "=========================================================\n"
