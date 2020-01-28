const url = 'http://localhost:3000/pokemon'

const pokemonHTML = (pObj) => {
    return (`
    <div class="pokemon-card">
        <div class="pokemon-frame">
            <h1 class="center-text">${pObj.name}</h1>
            <div class="pokemon-image">
                <img data-id="${pObj.id}" data-action="flip" class="toggle-sprite" src="${pObj.sprites.front}">
            </div>
            <button data-action="delete" class="pokemon-button">Delete</button>
        </div>
    </div>`
)}

const pokemonArrHTML = (pArr) => {
    return pArr.map(p => pokemonHTML(p)).join('')
}

const handleSearch = (e, pokemon, container) => {
    const query = e.target.value
    const pokeArr = pokemon.filter(p => p.name.includes(query.toLowerCase()))
    container.innerHTML = pokemonArrHTML(pokeArr)
}

const handleClick = (e, pokemon, container, updateMemoized) => {
    switch (e.target.dataset.action){
        case "flip":
            const id = parseInt(e.target.dataset.id)
            const poke = pokemon.find(p => p.id === id)
            
            e.target.src = (e.target.src === poke.sprites.front) ? poke.sprites.back : poke.sprites.front
            break
        case "delete":
            const pId = e.target.parentNode.querySelector(".pokemon-image img").dataset.id
            fetch(url + `/${pId}`, {method: "DELETE"})
                .then(() => {
                    pokemon = pokemon.filter(poke => poke.id != pId)
                    container.innerHTML = pokemonArrHTML(pokemon)
                    updateMemoized(pokemon)
                })
            break
        default:
            console.log("Default action in container")
    }
}

const handleSubmit = (e, pokemon, container) => {
    e.preventDefault()
    // e.stopPropagation()
    const nameInput = e.target.querySelector("#name-input")
    const urlInput = e.target.querySelector("#sprite-input")
    const name = nameInput.value
    const sprite = urlInput.value
    const id = pokemon[pokemon.length - 1].id + 1

    const method = 'POST'
    const headers = {
        'Content-Type': 'application/json'
    }
    const data = {
        name,
        id,
        sprites: {
            front: sprite,
            back: sprite
        }
    }
    const opt = { method, headers, body: JSON.stringify(data)}
    fetch(url, opt)
        .then(res => {
            return res.json()
        })
        .then(json => {
            pokemon.push(json)
            container.innerHTML = pokemonArrHTML(pokemon)
        })
        .catch(err => {
            console.error(err)
            container.innerHTML = pokemonArrHTML(pokemon)
        })

    const optimisticHMTL = pokemonHTML(data)
    container.innerHTML += optimisticHMTL
}