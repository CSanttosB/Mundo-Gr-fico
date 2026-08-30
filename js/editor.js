// Motor de Edición Visual Integral (Textos + Fotos + Enlaces)
document.addEventListener('DOMContentLoaded', () => {
    const toolbarHTML = `
        <div id="visual-editor-toolbar" class="fixed bottom-4 left-4 z-[999] bg-gray-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl p-2.5 flex items-center gap-3 border border-gray-700 font-sans">
            <button id="btn-edit-mode" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-sm cursor-pointer">
                ✏️ Activar Edición Total
            </button>
            <button id="btn-save-mode" class="px-4 py-2 bg-brand-red hover:bg-red-700 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 hidden shadow-lg cursor-pointer">
                💾 Guardar y Descargar
            </button>
            <span id="editor-hint" class="text-xs text-gray-400 hidden pr-2">💡 Haz clic en cualquier texto o foto para editar</span>
        </div>
        <input type="file" id="editor-file-input" accept="image/*" class="hidden">
        <dialog id="image-edit-modal" class="rounded-2xl p-6 bg-gray-900 text-white border border-gray-700 shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm max-w-md w-full">
            <h3 class="text-xl font-bold mb-3 flex items-center gap-2">🖼️ Cambiar Imagen</h3>
            <p class="text-sm text-gray-300 mb-6">Elige cómo quieres actualizar esta imagen:</p>
            <div class="flex flex-col gap-3 mb-6">
                <button id="btn-upload-local-img" class="w-full py-3 px-4 bg-brand-red hover:bg-red-700 rounded-xl font-semibold text-sm transition-colors text-left flex items-center gap-3 cursor-pointer">
                    <span class="text-lg">📁</span> Subir archivo desde mi PC (Reemplazo visual inmediato)
                </button>
                <button id="btn-input-url-img" class="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold text-sm transition-colors text-left flex items-center gap-3 cursor-pointer">
                    <span class="text-lg">🔗</span> Escribir ruta o nombre de archivo (ej: images/foto.jpg)
                </button>
            </div>
            <div class="flex justify-end">
                <button id="btn-cancel-img-edit" class="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Cancelar</button>
            </div>
        </dialog>
    `;
    
    if (!document.getElementById('visual-editor-toolbar')) {
        document.body.insertAdjacentHTML('beforeend', toolbarHTML);
    }

    const btnEdit = document.getElementById('btn-edit-mode');
    const btnSave = document.getElementById('btn-save-mode');
    const editorHint = document.getElementById('editor-hint');
    const fileInput = document.getElementById('editor-file-input');
    const imgModal = document.getElementById('image-edit-modal');
    const btnUploadLocal = document.getElementById('btn-upload-local-img');
    const btnInputUrl = document.getElementById('btn-input-url-img');
    const btnCancelImg = document.getElementById('btn-cancel-img-edit');
    
    let isEditing = false;
    let activeTargetElement = null;
    const editableTextSelectors = 'h1, h2, h3, h4, h5, h6, p, span, a, button, li, strong, b';

    btnEdit.addEventListener('click', () => {
        isEditing = !isEditing;
        if (isEditing) {
            document.body.classList.add('edit-mode-active');
            document.querySelectorAll(editableTextSelectors).forEach(el => {
                if (!el.closest('#visual-editor-toolbar') && !el.closest('#image-edit-modal') && !el.closest('#lightbox')) {
                    el.setAttribute('contenteditable', 'true');
                }
            });
            btnEdit.innerHTML = "❌ Salir de Edición";
            btnEdit.classList.replace('bg-gray-800', 'bg-gray-600');
            btnSave.classList.remove('hidden');
            editorHint.classList.remove('hidden');
        } else {
            document.body.classList.remove('edit-mode-active');
            document.querySelectorAll('[contenteditable="true"]').forEach(el => {
                el.removeAttribute('contenteditable');
            });
            btnEdit.innerHTML = "✏️ Activar Edición Total";
            btnEdit.classList.replace('bg-gray-600', 'bg-gray-800');
            btnSave.classList.add('hidden');
            editorHint.classList.add('hidden');
        }
    });

    document.addEventListener('click', (e) => {
        if (!isEditing) return;
        const targetImg = e.target.closest('img') || (e.target.style.backgroundImage ? e.target : (e.target.classList.contains('panel') ? e.target : null));
        if (targetImg && !targetImg.closest('#visual-editor-toolbar') && !targetImg.closest('#image-edit-modal') && !targetImg.closest('#lightbox')) {
            e.preventDefault();
            e.stopPropagation();
            activeTargetElement = targetImg;
            imgModal.showModal();
        }
    }, true);

    btnUploadLocal.addEventListener('click', () => {
        imgModal.close();
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && activeTargetElement) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (activeTargetElement.tagName === 'IMG') {
                    activeTargetElement.src = event.target.result;
                } else {
                    activeTargetElement.style.backgroundImage = `url('${event.target.result}')`;
                }
            };
            reader.readAsDataURL(file);
        }
        fileInput.value = '';
    });

    btnInputUrl.addEventListener('click', () => {
        imgModal.close();
        const currentSrc = activeTargetElement.tagName === 'IMG' 
            ? activeTargetElement.getAttribute('src') 
            : activeTargetElement.style.backgroundImage.slice(4, -1).replace(/["']/g, "");
        const newPath = prompt("Introduce la ruta o URL de la nueva imagen:\n(Ejemplo: images/rotulacion_fachada.jpg o un enlace https://)", currentSrc || "");
        if (newPath && activeTargetElement) {
            if (activeTargetElement.tagName === 'IMG') {
                activeTargetElement.src = newPath;
            } else {
                activeTargetElement.style.backgroundImage = `url('${newPath}')`;
            }
        }
    });

    btnCancelImg.addEventListener('click', () => {
        imgModal.close();
    });

    btnSave.addEventListener('click', () => {
        document.body.classList.remove('edit-mode-active');
        document.querySelectorAll('[contenteditable="true"]').forEach(el => {
            el.removeAttribute('contenteditable');
        });
        
        const toolbar = document.getElementById('visual-editor-toolbar');
        const fileInputEl = document.getElementById('editor-file-input');
        const imgModalEl = document.getElementById('image-edit-modal');
        
        const prevToolbarDisplay = toolbar.style.display;
        toolbar.style.display = 'none';
        if (fileInputEl) fileInputEl.remove();
        if (imgModalEl) imgModalEl.remove();
        
        const htmlContent = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
        
        toolbar.style.display = prevToolbarDisplay;
        if (fileInputEl) document.body.appendChild(fileInputEl);
        if (imgModalEl) document.body.appendChild(imgModalEl);

        let currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (!currentPage.endsWith('.html')) currentPage = 'index.html';

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = currentPage;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        alert(`¡Cambios guardados con éxito!\n\nSe ha descargado '${currentPage}'. Reemplázalo en tu carpeta 'Mundo Grafico' para conservar todos tus cambios.`);
        
        btnEdit.innerHTML = "✏️ Activar Edición Total";
        btnEdit.classList.replace('bg-gray-600', 'bg-gray-800');
        btnSave.classList.add('hidden');
        editorHint.classList.add('hidden');
        isEditing = false;
    });
});
