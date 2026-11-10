# Andara Rent a Car — sitio web estático

Página comercial de demostración para una empresa ficticia de alquiler de vehículos en Córdoba.
HTML5 + CSS3 + JavaScript puro, sin frameworks ni backend.

## Estructura

```
rent-a-car/
├── index.html          Estructura y contenido de todas las secciones
├── css/styles.css      Estilos (variables, componentes, animaciones, responsive)
├── js/main.js          Flota, filtros, menú móvil, animaciones, formulario → WhatsApp
└── assets/
    ├── images/         Imágenes propias (las fotos actuales se sirven desde Unsplash)
    └── icons/          favicon.svg (isotipo de la marca)
```

## Cómo verlo localmente

Opción rápida: abrir `index.html` con doble clic en cualquier navegador.

Opción recomendada (servidor local, igual que en producción):

```bash
cd rent-a-car
python -m http.server 8080
```

Luego abrir http://localhost:8080. También sirve la extensión *Live Server* de VS Code.

Se necesita conexión a internet para las fotos (Unsplash), las tipografías (Google Fonts),
los íconos (Lucide) y el mapa (Google Maps).

## Personalizar

- **Número de WhatsApp:** `CONFIG.whatsappNumber` en `js/main.js` (formato internacional sin `+`).
  El número del HTML visible está en la sección Contacto.
- **Vehículos:** editar la lista `FLEET` en `js/main.js`. Cada objeto genera su tarjeta,
  su filtro y su opción en el formulario.
- **Colores y tipografías:** variables al comienzo de `css/styles.css`.

## Notas

- El formulario **no guarda ni envía datos** a ningún servidor: valida los campos y abre
  WhatsApp con el mensaje armado para que la persona lo envíe.
- Empresa, dirección, teléfonos y correo son ficticios.
