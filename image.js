
    alert("Developed By : Daksh Hiral Shah . A service by Byte Tech Labs")
    const canvas = document.getElementById("canvas");
    const input = document.getElementById("uploadImage");
    let zCounter = 1;
    let activeBox = null;

    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () {
        createImageBox(reader.result);
      };
      reader.readAsDataURL(file);
    });

    function createImageBox(src, style = {}) {
      const imgBox = document.createElement("div");
      imgBox.className = "img-box";
      imgBox.style.left = style.left || "50px";
      imgBox.style.top = style.top || "50px";
      imgBox.style.width = style.width || "200px";
      imgBox.style.height = style.height || "150px";
      imgBox.style.zIndex = style.zIndex || zCounter++;

      const img = document.createElement("img");
      img.src = src;
      img.classList.add('img-class');
      img.style.border = "4px solid black";

      const resizeHandle = document.createElement("div");
      resizeHandle.className = "resize-handle";

      imgBox.appendChild(img);
      imgBox.appendChild(resizeHandle);
      canvas.appendChild(imgBox);

      makeDraggable(imgBox);
      makeResizable(resizeHandle, imgBox);

      imgBox.addEventListener("mousedown", () => setActive(imgBox));
    }

    let isResizing = false;

function makeDraggable(elem) {
  let offsetX, offsetY;

  elem.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("resize-handle")) return; // Prevent drag if resizing
    isResizing = false;

    offsetX = e.offsetX;
    offsetY = e.offsetY;

    function moveHandler(ev) {
      if (isResizing) return; // Don't move if resizing
      elem.style.left = ev.pageX - offsetX + "px";
      elem.style.top = ev.pageY - offsetY + "px";
    }

    function upHandler() {
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("mouseup", upHandler);
    }

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", upHandler);
  });
}

function makeResizable(handle, imgBox) {
  handle.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing = true;

    const initialWidth = parseInt(imgBox.style.width, 10);
    const initialHeight = parseInt(imgBox.style.height, 10);
    const initialX = e.clientX;
    const initialY = e.clientY;

    function resizeHandler(ev) {
      const dx = ev.clientX - initialX;
      const dy = ev.clientY - initialY;

      imgBox.style.width = Math.max(50, initialWidth + dx) + "px";
      imgBox.style.height = Math.max(50, initialHeight + dy) + "px";
    }

    function upHandler() {
      isResizing = false;
      document.removeEventListener("mousemove", resizeHandler);
      document.removeEventListener("mouseup", upHandler);
    }

    document.addEventListener("mousemove", resizeHandler);
    document.addEventListener("mouseup", upHandler);
  });
}


    function setActive(box) {
      if (activeBox) activeBox.classList.remove("active");
      activeBox = box;
    }



    function bringForward() {
      if (activeBox) {
        activeBox.style.zIndex = zCounter++;
      }
    }

    function sendBackward() {
      if (activeBox) {
        activeBox.style.zIndex = 1;
      }
    }

    function deleteImage() {
      if (activeBox) {
        canvas.removeChild(activeBox);
        activeBox = null;
      }
    }

    function exportLayout() {
      html2canvas(canvas).then((canvasExport) => {
        const link = document.createElement("a");
        link.download = "layout.png";
        link.href = canvasExport.toDataURL();
        link.click();
      });
    }

    function hideLayout() {
      document.querySelector('.header').style = "display:none;";
    }

    function saveLayout() {
      const boxes = [...canvas.querySelectorAll(".img-box")];
      const layout = boxes.map((box) => ({
        src: box.querySelector("img").src,
        left: box.style.left,
        top: box.style.top,
        width: box.style.width,
        height: box.style.height,
        zIndex: box.style.zIndex,
      }));
      localStorage.setItem("imageLayout", JSON.stringify(layout));
      alert("Layout saved!");
    }

    function loadLayout() {
      canvas.innerHTML = "";
      const layout = JSON.parse(localStorage.getItem("imageLayout"));
      if (!layout) return;
      layout.forEach((item) => {
        createImageBox(item.src, item);
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        // Deselect image when spacebar is pressed
        if (activeBox) activeBox.classList.remove("active");
        activeBox = null;
      }

      if (!activeBox) return;
      const step = 5;
      const left = parseInt(activeBox.style.left, 10);
      const top = parseInt(activeBox.style.top, 10);
      switch (e.key) {
        case "ArrowUp":
          activeBox.style.top = top - step + "px";
          break;
        case "ArrowDown":
          activeBox.style.top = top + step + "px";
          break;
        case "ArrowLeft":
          activeBox.style.left = left - step + "px";
          break;
        case "ArrowRight":
          activeBox.style.left = left + step + "px";
          break;
      }
    });

 function setOutline(style) {
  if (!activeBox) {
    alert("Select an image first!");
    return;
  }
  const img = activeBox.querySelector('.img-class');
  console.log(img)
  img.style.border = style;
}