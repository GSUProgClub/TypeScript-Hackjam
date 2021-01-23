const form = document.querySelector<HTMLFormElement>(".top-banner form");
const input = document.querySelector<HTMLInputElement>(".top-banner input");
const msg = document.querySelector<HTMLOutputElement>(".top-banner .msg");
const list = document.querySelector<HTMLUListElement>(".ajax-section .cities");

const apiKey = "<Insert API Key>";

form.addEventListener("submit", e => {
    e.preventDefault();
    let inputVal = input.value;

    // check if there's already a city
    const listItems = list.querySelectorAll<HTMLLIElement>(".ajax-section .cities");
    const listItemsArray = Array.from(listItems);

    if (listItemsArray.length > 0) {
        const filteredArray = listItemsArray.filter(el => {
            let content: string;

            // check if it contains a country code
            // Eg: US, UK, GB, IN, etc.
            if (inputVal.includes(",")) {
                // checks if the country code is valid
                if (inputVal.split(",")[1].length > 2) {
                    inputVal = inputVal.split(",")[0];
                    content = el.querySelector(".city-name span").textContent.toLowerCase();
                } else {
                    content = el.querySelector(".city-name span").textContent.toLowerCase();
                }
            } else {
                // if there's no country code
                content = el.querySelector(".city-name span").textContent.toLowerCase();
            }
            return content == inputVal.toLowerCase();
        });

        if (filteredArray.length > 0) {
            msg.textContent = `You already know the weather for 
                ${filteredArray[0].querySelector(".city-name span").textContent} 
                ...otherwise be more specific by providing the country code as well`;

            form.reset();
            input.focus();
            return;
        }
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

    getData(url)
        .then(
            data => {
                const icon = `https://openweathermap.org/img/wn/${data.weather[0]["icon"]}@2x.png`;
                const li = document.createElement("li");
                li.classList.add("city");
                li.innerHTML = `
                <h2 class ="city-name" data-name"${data.name}, ${data.sys.country}">
                    <span>${data.name}</span>
                    <sup>${data.sys.country}</sup>
                </h2>
                <div class="city-temp">${Math.round(data.main.temp)}<sup>C</sup>
                </div>
                <figure>
                    <img class="city-icon" src=${icon} alt=${data.weather[0]["main"]}>
                    <figcaption>${data.weather[0]["description"]}</figcaption>
                </figure>
                `;
                list.appendChild(li);
            }
        ).catch(() => {
            msg.textContent = "Please search for a valid city";
    });
    msg.textContent = "";
    form.reset();
    input.focus();
});

function getData(url: String): Promise<Data> {
    return fetch(url)
        .then(response => response.json())
        .then(response => {
            return response as Data
        })
}

export interface Data{
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    };
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    sys: {
        type: number;
        id: number;
        message: number;
        country: string;
        sunrise: number;
        sunset: number;
    };
    name: string;
}