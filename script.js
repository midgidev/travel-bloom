window.addEventListener('load', (ev)=>{
    console.log("loaded")

    const searchBtn = document.getElementById('searchBtn');
    const eraserBtn = document.getElementById('eraserBtn');
    const searchInput = document.getElementById('searchInput');
    const destinationsWrapper = document.getElementById('destinationsWrapper');
    const destinationHour = document.getElementById('destinationHour');
    destinationHour.style.display = 'none';

    const destinationDB = {
        indonesia: {
            keywords: ['beach', 'tropical', 'vacation', 'paradise', 'nature', 'temples'],
            image: 'bali.jpg',
            name: 'Indonesia',
            description: 'Indonesia is a tropical paradise known for its stunning beaches, rich culture, and lush natural landscapes, perfect for vacationers seeking adventure and relaxation.',
            locale: 'id-ID', // Código de localización para Indonesia (Indonesio)
            timeZone: 'Asia/Jakarta' // Zona horaria de Indonesia
        },
        france: {
            keywords: ['romance', 'culture', 'architecture', 'vacation', 'beautiful'],
            image: 'paris.jpg',
            name: 'France',
            description: 'France offers a blend of romance, history, and world-renowned culture, with iconic landmarks like the Eiffel Tower and charming countryside villages.',
            locale: 'fr-FR', // Código de localización para Francia (Francés)
            timeZone: 'Europe/Paris' // Zona horaria de Francia
        },
        iceland: {
            keywords: ['nature', 'waterfalls', 'volcano', 'aurora borealis', 'adventure'],
            image: 'iceland.jpg',
            name: 'Iceland',
            description: 'Iceland is a land of natural wonders, from dramatic waterfalls and volcanoes to the magical aurora borealis, ideal for adventurous travelers.',
            locale: 'is-IS', // Código de localización para Islandia (Islandés)
            timeZone: 'Atlantic/Reykjavik' // Zona horaria de Islandia
        },
        maldives: {
            keywords: ['beach', 'luxury', 'tropical', 'vacation', 'romance'],
            image: 'maldives.jpg',
            name: 'Maldives',
            description: 'The Maldives is a luxurious tropical destination offering pristine white-sand beaches, crystal-clear waters, and exclusive resorts for the ultimate romantic getaway.',
            locale: 'dv-MV', // Código de localización para las Maldivas (Dhivehi)
            timeZone: 'Indian/Maldives' // Zona horaria de las Maldivas
        },
        japan: {
            keywords: ['culture', 'temples', 'nature', 'vacation', 'cherry blossoms'],
            image: 'japan.jpg',
            name: 'Japan',
            description: 'Japan is a captivating mix of ancient traditions and modern marvels, featuring beautiful temples, scenic nature, and famous cherry blossoms in spring.',
            locale: 'ja-JP', // Código de localización para Japón (Japonés)
            timeZone: 'Asia/Tokyo' // Zona horaria de Japón
        }
    };
    
    
    // Función para obtener la fecha y hora con un time zone específico
    const getLocalTime = (timeZone) => {
        const date = new Date();  // Obtiene la fecha y hora actual
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',      // Día de la semana (Ejemplo: "lunes")
            year: 'numeric',      // Año (Ejemplo: "2025")
            month: 'long',        // Mes (Ejemplo: "febrero")
            day: 'numeric',       // Día del mes (Ejemplo: "15")
            hour: 'numeric',      // Hora (Ejemplo: "15")
            minute: 'numeric',    // Minutos (Ejemplo: "30")
            second: 'numeric',    // Segundos (Ejemplo: "45")
            timeZoneName: 'short', // Nombre de la zona horaria (Ejemplo: "GMT")
            timeZone: timeZone
        }).format(date);
    };

    function cleanText(text){
        return text.trim().toLowerCase();
    }

    function getDestinationCountry(country){
        return destinationDB[country];
    }

    function getDestinationsByKeyword(keyword){
        if(keyword.trim().length < 3) return [];
        return Object.values(destinationDB).filter(destination=>destination.keywords.some((k)=>{
            return k.toLowerCase().includes(keyword.toLowerCase())
        }));
    }

    function searchDestinations(text){
        text = cleanText(text);
        const destinationCountry = getDestinationCountry(text);
        if(destinationCountry){
            console.log(`hora en ${text}: ${getLocalTime(destinationCountry.timeZone)}`)
            return {
                type: 'country',
                destinationList: [destinationCountry]
            };
        }
        return {
            type: 'category',
            destinationList: getDestinationsByKeyword(text)
        };
    }

    function removeDestinations(){
        destinationsWrapper.querySelectorAll('.card-destination').forEach(el=>el.remove());
    }

    function showDestinations(destinationList){
        let html = ``;

        destinationList.forEach(destination=>{
            html += `<div class="card card-destination">
                <img src="assets/images/${destination.image}" class="card-img-top" alt="${destination.name}">
                <div class="card-body">
                    <h5><strong>${destination.name}</strong></h5>
                    <p class="card-text">${destination.description}</p>
                </div>
            </div>\n`;
        })
        //console.log(destinationsWrapper.querySelectorAll('.card-destination'))
        
        removeDestinations();
        destinationsWrapper.innerHTML = destinationsWrapper.innerHTML + html;
    }

    function searchText(){
        const destinationHour = document.getElementById('destinationHour');
        destinationHour.style.display = 'none';
        console.log("click search");
        const searchText = searchInput.value;
        console.log("search text: "+searchText);
        const searchResult = searchDestinations(searchText);

        console.log("search destinations: ", searchResult.destinationList);

        if(searchResult.type === 'country'){
            console.log("es country")
            const destination = searchResult.destinationList[0];
            const localTime = getLocalTime(destination.timeZone);
            destinationHour.innerHTML = localTime + ` ${destination.name}`;
            destinationHour.style.display = 'block';
            console.log("destination hour style display: ", destinationHour.style.display)
            console.log({localTime})
        }
        showDestinations(searchResult.destinationList);
    }

    searchInput.addEventListener("keypress", function(event) {
        //event.preventDefault();
        if (event.keyCode == 13)
            searchText();
    });

    searchBtn.addEventListener('click', (ev)=>{
        ev.stopPropagation();
        searchText();
    });

    eraserBtn.addEventListener('click', (ev)=>{
        ev.stopPropagation();
        const destinationHour = document.getElementById('destinationHour');
        searchInput.value = '';
        destinationHour.innerHTML = '';
        destinationHour.style.display = 'none';
        console.log("destination hour style display: ", destinationHour.style.display)
        showDestinations([]);
    })
});