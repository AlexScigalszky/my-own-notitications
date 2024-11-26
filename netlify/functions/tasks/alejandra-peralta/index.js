const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
// const fs = require('fs');

async function scrollToBottom(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            let distance = 100; // Distancia a desplazarse en cada paso
            const timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function scrapeProperties(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    // Hacer clic 30 veces en el botón "Cargar más"
    for (let i = 0; i < 30; i++) {
        console.log('iteración:', i)
        try {
            await page.evaluate(() => {
                const elements = [...document.getElementsByClassName('mdl-button mdl-js-button mdl-button--raised mdl-button--primary mdl-button--lg')]; // Seleccionar todos los elementos
                elements[0].click();
                return elements[0].innerText?.trim();
            }).then(x => console.log('clicked on button: ' + x))

            await scrollToBottom(page);
            await page.waitForNetworkIdle({ idleTime: 500 });
        } catch (error) {
            console.error(`Error al hacer clic en el botón: ${error.message}`);
            break; // Salir del bucle si hay un error
        }
    }

    // Obtener el HTML de la página después de los clics
    const content = await page.content();
    const $ = cheerio.load(content);

    const properties = [];
    const interested_properties = [];
    const notIntersting = [
        "https://alejandraperalta.com.ar/propiedades/venta/campos-y-agro/otras-localidades/30-has-zona-san-cayetano/"
    ];

    // Buscar propiedades
    $('.mh-property').each((index, element) => {
        const title = $(element).find('.mh-estate-vertical__heading a').text().trim();
        const priceText = $(element).find('.mh-estate-vertical__primary div').text().trim(); // Precio original
        const link = $(element).find('.mh-estate-vertical__heading a').attr('href');

        // Limpiar el precio para obtener un número
        const price = parseFloat(priceText
            .replace(/U\$S|[^\d.-]/g, '')
            .replace(/\./g, '')
        ); // Elimina el símbolo y caracteres no numéricos

        if (price < 10000 && notIntersting.filter(link).length == 0)
            interested_properties.push({ title, priceText, price, link }); // Usar priceText para mostrar el precio original
        properties.push({ title, priceText, price, link }); // Usar priceText para mostrar el precio original

    });

    console.log(' Properties found: ' + properties.length + '. ' + interested_properties.length + 'interesting');
    // fs.writeFileSync('interested_properties.json', JSON.stringify(interested_properties, null, 2), 'utf-8');
    // fs.writeFileSync('properties.json', JSON.stringify(properties, null, 2), 'utf-8');

    await browser.close();

    return {
        resultado: JSON.stringify(interested_properties),
        asunto: "Alejandra Peralta: Menos de USD 10.000"
    }
}

const execute = async () => {
    return await scrapeProperties('https://alejandraperalta.com.ar/propiedades/venta/');
};

module.exports = { execute };