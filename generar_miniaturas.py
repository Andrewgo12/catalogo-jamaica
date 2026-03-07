#!/usr/bin/env python3
"""
Script para generar miniaturas PNG transparentes a partir de imágenes JPEG
Requiere: pip install Pillow
"""

import os
from PIL import Image

def crear_miniaturas():
    img_dir = "img"
    miniaturas_dir = os.path.join(img_dir, "miniaturas")
    
    # Crear directorio de miniaturas si no existe
    if not os.path.exists(miniaturas_dir):
        os.makedirs(miniaturas_dir)
        print(f"✅ Directorio {miniaturas_dir} creado")
    
    # Procesar todos los archivos JPEG
    for filename in os.listdir(img_dir):
        if filename.lower().endswith(('.jpeg', '.jpg')) and filename.startswith('prod_'):
            try:
                # Abrir imagen original
                img_path = os.path.join(img_dir, filename)
                img = Image.open(img_path)
                
                # Convertir a RGBA (soporta transparencia)
                img = img.convert('RGBA')
                
                # Redimensionar a miniatura (ej: 200x200 manteniendo proporción)
                size = (200, 200)
                img.thumbnail(size, Image.Resampling.LANCZOS)
                
                # Crear imagen transparente del mismo tamaño
                background = Image.new('RGBA', size, (0, 0, 0, 0))
                
                # Centrar la imagen en el fondo transparente
                offset = ((size[0] - img.size[0]) // 2, (size[1] - img.size[1]) // 2)
                background.paste(img, offset, img)
                
                # Guardar como PNG transparente
                prod_num = filename.split('_')[1].split('.')[0]
                output_filename = f"prod_{prod_num.zfill(2)}.png"
                output_path = os.path.join(miniaturas_dir, output_filename)
                
                background.save(output_path, 'PNG', optimize=True)
                print(f"✅ Miniatura creada: {output_path}")
                
            except Exception as e:
                print(f"❌ Error procesando {filename}: {e}")

if __name__ == "__main__":
    print("🎨 Generando miniaturas PNG transparentes...")
    crear_miniaturas()
    print("✨ Proceso completado!")
