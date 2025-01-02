# 我们将使用这个经过验证的 comfyui 镜像作为基础
FROM ghcr.io/ai-dock/comfyui:v2-cuda-12.1.1-base-22.04-v0.2.7

# 禁用基础镜像提供的身份验证
ENV WEB_ENABLE_AUTH=false
 
# 现在我们将模型复制到镜像中
ENV MODEL_DIR=/opt/ComfyUI/models
COPY checkpoints/dreamshaperXL_sfwV2TurboDPMSDE.safetensors ${MODEL_DIR}/checkpoints/dreamshaperXL_sfwV2TurboDPMSDE.safetensors
COPY controlnet/sai_xl_canny_256lora.safetensors ${MODEL_DIR}/controlnet/sai_xl_canny_256lora.safetensors
COPY controlnet/sai_xl_depth_256lora.safetensors ${MODEL_DIR}/controlnet/sai_xl_depth_256lora.safetensors
COPY loras/StudioGhibli.Redmond-StdGBRRedmAF-StudioGhibli.safetensors ${MODEL_DIR}/loras/StudioGhibli.Redmond-StdGBRRedmAF-StudioGhibli.safetensors

ENV NODE_DIR=/opt/ComfyUI/custom_nodes
COPY custom_nodes/ComfyUI_Comfyroll_CustomNodes ${NODE_DIR}/ComfyUI_Comfyroll_CustomNodes
COPY custom_nodes/comfyui_controlnet_aux ${NODE_DIR}/comfyui_controlnet_aux
COPY custom_nodes/comfyui-art-venture ${NODE_DIR}/comfyui-art-venture
COPY custom_nodes/ComfyUI-Custom-Scripts ${NODE_DIR}/ComfyUI-Custom-Scripts
COPY custom_nodes/ComfyUI-WD14-Tagger ${NODE_DIR}/ComfyUI-WD14-Tagger

# 启动前脚本
COPY provisioning.sh /opt/ai-dock/bin/provisioning.sh

# 我们还需要将 comfyui-api 二进制文件复制到镜像中，因为 ComfyUI 默认完全异步，没有方便的方式来获取生成的图像
ADD https://github.com/SaladTechnologies/comfyui-api/releases/download/1.6.1/comfyui-api .
RUN chmod +x comfyui-api

# 可选：通过在启动服务器之前运行工作流来预热服务器
# comfyui-api 支持预热模式，它将在启动服务器之前运行提供的工作流
# 此示例假设你在 Dockerfile 所在的目录中有一个工作流 json 文件
COPY sanhua.json .
ENV WARMUP_PROMPT_FILE=sanhua.json

CMD ["./comfyui-api"]
