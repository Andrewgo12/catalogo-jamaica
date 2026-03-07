#!/usr/bin/env python3
"""
Script simple para remover fondo claro de imágenes
Solo requiere Pillow
"""

import os
from PIL import Image

def remover_fondo_claro(img_path, umbral_brillo=220):
    """Remueve fondo claro/blanco de una imagen"""
    try:
        img = Image.open(img_path).convert('RGBA')
        width, height = img.size
        pixels = img.load()
        
        # Recorrer cada píxel
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                
                # Calcular brillo del píxel
                brillo = (r + g + b) / 3
                
                # Si el píxel es muy claro, hacerlo transparente
                if brillo > umbral_brillo:
                    pixels[x, y] = (r, g, b, 0)  # Hacer transparente
        
        return img
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def recortar_contenido(img):
    """Recorta la imagen para eliminar espacios transparentes"""
    try:
        bbox = img.getbbox()
        if bbox:
            return img.crop(bbox)
        return img
    except:
        return img

def crear_miniaturas_profesionales():
    img_dir = "img"
    miniaturas_dir = os.path.join(img_dir, "miniaturas")
    
    # Limpiar y crear directorio
    if os.path.exists(miniaturas_dir):
        import shutil
        shutil.rmtree(miniaturas_dir)
    os.makedirs(miniaturas_dir)
    
    print("🎨 Creando miniaturas profesionales (sin fondo)...")
    
    for filename in sorted(os.listdir(img_dir)):
        if filename.lower().endswith(('.jpeg', '.jpg')) and filename.startswith('prod_'):
            try:
                img_path = os.path.join(img_dir, filename)
                print(f"🔄 Procesando {filename}...")
                
                # Abrir imagen original
                img = Image.open(img_path).convert('RGBA')
                
                # Intentar remover fondo claro
                img_sin_fondo = remover_fondo_claro(img_path, umbral_brillo=200)
                
                if img_sin_fondo is None:
                    img_sin_fondo = img
                
                # Recortar al contenido
                img_sin_fondo = recortar_contenido(img_sin_fondo)
                
                # Redimensionar manteniendo calidad
                max_size = 250
                img_sin_fondo.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                
                # Guardar como PNG transparente
                prod_num = filename.split('_')[1].split('.')[0]
                output_filename = f"prod_{prod_num.zfill(2)}.png"
                output_path = os.path.join(miniaturas_dir, output_filename)
                
                img_sin_fondo.save(output_path, 'PNG', optimize=True)
                
                # Mostrar tamaño del archivo
                size_kb = os.path.getsize(output_path) / 1024
                print(f"✅ {output_filename} ({size_kb:.1f} KB)")
                
            except Exception as e:
                print(f"❌ Error con {filename}: {e}")

if __name__ == "__main__":
    print("🖼️  Generando miniaturas con fondo removido...")
    print("⚠️  Esto funcionará mejor para productos con fondo claro/blanco")
    crear_miniaturas_profesionales()
    print("\n✨ Proceso completado!")
    print("\n💡 Para mejores resultados:")
    print("   - Las imágenes originales deben tener fondo claro/blanco")
    print("   - Para fondos complejos, usa Photoshop o remove.bg profesionalmente")
