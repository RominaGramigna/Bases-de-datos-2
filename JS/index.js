
function vaciarInputs() {
    const formulario = document.getElementById('product-form');
    console.log(formulario);
    
    if(formulario) {
        const inputs = document.querySelectorAll('#product-form' + ' input, textarea, select');
        inputs.forEach(input => {
            input.value = '';
        })
    }
}

function vaciarResultados() {
    const results = document.getElementById('product-list');
    results.innerHTML = '';
}

function soloLectura() {
    const formulario = document.getElementById('product-form');
    console.log(formulario);
    
    if(formulario) {
        const inputs = document.querySelectorAll('#product-form' + ' input, textarea, select');
        inputs.forEach(input => {
            input.setAttribute('readonly', true);
        })
    }
}

function botonModificar() {
        const formulario = document.getElementById('product-form');
                
        if(formulario) {
            const inputs = document.querySelectorAll('#product-form' + ' input, textarea, select');

            inputs.forEach(input => {
                input.removeAttribute('readonly')
            });
        }
}

function botonAgregar() {
    vaciarInputs();
    botonModificar();
    vaciarResultados();
}

/********************************************************** */

document.getElementById('search').addEventListener('input', () => {
    const searchTerm = document.getElementById('search').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-producto?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('product-list');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.ID_Articulo + ", Articulo: " + item.Articulo + ", Categoria: " + item.Categoria + ", Precio: " + item.Precio + ", Cantidad: " + item.Cantidad];
                li.dataset.id = item.ID_Articulo;
                li.addEventListener('click', () => {
                    soloLectura();
                    selectResult(item.ID_Articulo);
                });
                botonModificar()
                searchResults.appendChild(li);
            });
        });
});


function selectResult(ID_Articulo) {
    fetch(`http://localhost:3000/api/completar-producto/${ID_Articulo}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos del producto recibidos:', data);

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('product-id').value = data.ID_Articulo;
            document.getElementById('product-name').value = data.Articulo;
            document.getElementById('product-category').value = data.Categoria;
            document.getElementById('product-price').value = data.Precio;
            document.getElementById('product-quant').value = data.Cantidad;
        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

const categorias = ["Bebida", "Aceite", "Higiene personal", "Comestibles"];

        // Seleccionar el elemento select
        const selectElement = document.getElementById("product-category");

        // Recorrer el array y crear elementos option
        categorias.forEach(categoria => {
            const optionElement = document.createElement("option");
            optionElement.value = categoria;
            optionElement.textContent = categoria;
            selectElement.appendChild(optionElement);
        });

/*************************** INSERCION **********************************/
async function guardarDatos() {
    
    // Obtener los valores de los campos del formulario
    const id_articulo = document.getElementById('product-id').value;
    const articulo = document.getElementById('product-name').value;
    const categoria = document.getElementById('product-category').value;
    const precio = document.getElementById('product-price').value;
    const cantidad = document.getElementById('product-quant').value;
    

    // Crear un objeto con los datos
    const producto = {
      ID_Articulo: id_articulo,
      Articulo: articulo,
      Categoria: categoria,
      Precio: precio,
      Cantidad: cantidad
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-producto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs();
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }  

/*********************** BORRADO *****************************************/
async function borrarDatos(ID_Articulo) {
    console.log('ID del producto a eliminar:', ID_Articulo);
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-producto/${ID_Articulo}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Producto eliminado:', data);
                alert('Producto eliminado correctamente');
                vaciarInputs();
                vaciarResultados();
                botonModificar();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Hubo un error al eliminar el producto');
        }
    }
}
