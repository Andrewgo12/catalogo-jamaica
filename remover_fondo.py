#!/usr/bin/env python3
"""
Script para remover fondo de imágenes y crear miniaturas PNG transparentes
Requiere: pip install Pillow removebg
"""

import os
from PIL import Image
import numpy as np

def remover_fondo_automatico(img_path):
    """Remueve el fondo usando técnicas de procesamiento de imágenes"""
    try:
        img = Image.open(img_path).convert('RGBA')
        data = np.array(img)
        
        # Convertir a HSV para mejor detección de fondo
        hsv = Image.fromarray(data).convert('HSV')
        hsv_data = np.array(hsv)
        
        # Detectar fondo claro (blanco/beige/claro)
        # Usando valores de saturación y brillo
        lower_sat = 30  # Saturación baja
        lower_val = 200  # Brillo alto
        
        # Crear máscara para fondo
        mask = (hsv_data[:,:,1] < lower_sat) & (hsv_data[:,:,2] > lower_val)
        
        # Aplicar suavizado a los bordes
        from scipy import ndimage
        mask = ndimage.binary_erosion(mask, iterations=2)
        mask = ndimage.binary_dilation(mask, iterations=1)
        
        # Hacer transparente el fondo
        data[mask] = [0, 0, 0, 0]
        
        return Image.fromarray(data)
    except ImportError:
        print("⚠️  Instala scipy: pip install scipy")
        return None
    except Exception as e:
        print(f"❌ Error en remoción de fondo: {e}")
        return None

def crear_miniaturas_sin_fondo():
    img_dir = "img"
    miniaturas_dir = os.path.join(img_dir, "miniaturas")
    
    # Limpiar directorio existente
    if os.path.exists(miniaturas_dir):
        import shutil
        shutil.rmtree(miniaturas_dir)
    os.makedirs(miniaturas_dir)
    
    print("🎨 Removiendo fondo de imágenes...")
    
    for filename in os.listdir(img_dir):
        if filename.lower().endswith(('.jpeg', '.jpg')) and filename.startswith('prod_'):
            try:
                img_path = os.path.join(img_dir, filename)
                print(f"🔄 Procesando {filename}...")
                
                # Remover fondo
                img_sin_fondo = remover_fondo_automatico(img_path)
                
                if img_sin_fondo is None:
                    # Si falla la remoción automática, solo redimensionar
                    img = Image.open(img_path).convert('RGBA')
                    img_sin_fondo = img
                
                # Recortar al contenido (eliminar espacios vacíos)
                bbox = img_sin_fondo.getbbox()
                if bbox:
                    img_sin_fondo = img_sin_fondo.crop(bbox)
                
                # Redimensionar manteniendo proporción
                max_size = 300
                img_sin_fondo.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                
                # Guardar como PNG
                prod_num = filename.split('_')[1].split('.')[0]
                output_filename = f"prod_{prod_num.zfill(2)}.png"
                output_path = os.path.join(miniaturas_dir, output_filename)
                
                img_sin_fondo.save(output_path, 'PNG', optimize=True)
                print(f"✅ Miniatura creada: {output_path}")
                
            except Exception as e:
                print(f"❌ Error procesando {filename}: {e}")

if __name__ == "__main__":
    print("🖼️  Generando miniaturas con fondo removido...")
    print("⚠️  Nota: Para mejores resultados, considera usar removebg o edición manual")
    crear_miniaturas_sin_fondo()
    print("✨ Proceso completado!")
    print("\n💡 Para resultados profesionales:")
    print("   1. pip install removebg")
    print("   2. Configura tu API key de remove.bg")
    print("   3. O edita manualmente con Photoshop/GIMP")
