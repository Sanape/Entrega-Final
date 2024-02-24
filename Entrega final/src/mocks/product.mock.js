import { faker } from "@faker-js/faker";

function generateRandomGPU() {
  return `${
    ["NVIDIA", "AMD", "INTEL"][
      faker.number.int({
        min: 0,
        max: 2,
      })
    ]
  } ${faker.word.sample()} ${faker.number.int()}GB ${faker.number.int({
    min: 1,
    max: 4,
  })}GHz`;
}

function generateRandomCPU() {
  return `${["AMD", "INTEL"][
    faker.number.int({
      min: 0,
      max: 2,
    })]} ${faker.word.sample()} ${faker.number.int({
    min: 2,
    max: 16,
  })} cores ${faker.number.int({ min: 2, max: 5 })}GHz`;
}

export const generateProduct = () => {
  return {
    id: faker.number.int({ min: 0 }),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    discount: faker.number.int({ min: 0 }),
    release_date: faker.date.anytime(),
    url_front_page: faker.image.url,
    front_page_public_id: faker.string.alphanumeric(15),
    popularity: faker.number.int({ min: 0 }),
    CPU: generateRandomCPU(),
    RAM: faker.number.int({ min: 0 }),
    memory: faker.number.int({ min: 0 }),
    GPU: generateRandomGPU(),
    idDeveloper: faker.number.int({ min: 0 }),
  };
};
