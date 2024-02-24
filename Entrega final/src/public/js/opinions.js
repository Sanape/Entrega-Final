const opinionForm = document.getElementById("opinionForm");
const userOpinion = document.getElementById("userOpinion");
const star1 = document.getElementById("star1");
const star2 = document.getElementById("star2");
const star3 = document.getElementById("star3");
const star4 = document.getElementById("star4");
const star5 = document.getElementById("star5");
const comment = document.getElementById("comment");
const usersOpinions = document.getElementById("usersOpinions");
let rating;

if (!Cookies.get("token") && !Cookies.get("user")) {
  userOpinion.style.display = "none";
}

async function getRatingOfCurrentUser() {
  try {
    let response;

    if (Cookies.get("token")) {
      response = await axios.get(`https://curso-coder-backend-production.up.railway.app/api/ratings`, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      response = await axios.get(`https://curso-coder-backend-production.up.railway.app/api/ratings`);
    }

    if (response.data.message) {
      comment.value = response.data.message.comment;
      rating = response.data.message.rating;
      for (let i = 1; i < 6; i++) {
        if (i <= response.data.message.rating) {
          document.getElementById("star" + i).className = document
            .getElementById("star" + i)
            .className.replace("100", "400");
        }
      }
    }
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

getRatingOfCurrentUser();

async function rate(info) {
  try {
    if (Cookies.get("token")) {
      await axios.post(`https://curso-coder-backend-production.up.railway.app/api/ratings`, info, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      await axios.post(`https://curso-coder-backend-production.up.railway.app/api/ratings`, info);
    }

    location.reload();
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

star1.onclick = (e) => {
  e.preventDefault();
  rating = 1;
  for (let i = 1; i < 6; i++) {
    if (i <= rating) {
      document.getElementById(
        "star" + i
      ).className = `fa-solid fa-star text-xl cursor-pointer text-yellow-400`;
    } else {
      document.getElementById(
        "star" + i
      ).className = `fa-solid fa-star text-xl cursor-pointer text-yellow-100`;
    }
  }
};

star2.onclick = (e) => {
  e.preventDefault();
  rating = 2;
  for (let i = 1; i < 6; i++) {
    if (i <= rating) {
      document.getElementById(
        "star" + i
      ).className = `fa-solid fa-star text-xl cursor-pointer text-yellow-400`;
    } else {
      document.getElementById(
        "star" + i
      ).className = `fa-solid fa-star text-xl cursor-pointer text-yellow-100`;
    }
  }
};

star3.onclick = (e) => {
  e.preventDefault();
  rating = 3;
  for (let i = 1; i < 6; i++) {
    if (i <= rating) {
      document.getElementById(
        "star" + i
      ).className = `fa-solid fa-star text-xl cursor-pointer text-yellow-400`;
    } else {
      document.getElementById(
        "star" + i
      ).className = `fa-solid fa-star text-xl cursor-pointer text-yellow-100`;
    }
  }
};

star4.onclick = (e) => {
  e.preventDefault();
  rating = 4;
  for (let i = 1; i < 6; i++) {
    if (i <= rating) {
      document.getElementById(
        "star" + i
      ).className = `fa-solid fa-star text-xl cursor-pointer text-yellow-400`;
    } else {
      document.getElementById(
        "star" + i
      ).className = `fa-solid fa-star text-xl cursor-pointer text-yellow-100`;
    }
  }
};

star5.onclick = (e) => {
  e.preventDefault();
  rating = 5;
  for (let i = 1; i < 6; i++) {
    if (i <= rating) {
      document.getElementById(
        "star" + i
      ).className = `fa-solid fa-star text-xl cursor-pointer text-yellow-400`;
    } else {
      document.getElementById(
        "star" + i
      ).className = `fa-solid fa-star text-xl cursor-pointer text-yellow-100`;
    }
  }
};

opinionForm.onsubmit = (e) => {
  e.preventDefault();
  if (!rating) {
    alert("Please select a rating");
  }
  const info = {
    rating: rating,
    comment: comment.value,
  };

  rate(info);
};

function compileRatings(ratings) {
  if (ratings.length > 0) {
    const ratingsTemplate = ratings.map(
      (rating) => `
      <div
      class="bg-indigo-50 rounded-md border-2 border-orange-600 flex flex-col gap-y-3 p-5 h-fit w-fit"
    >
    <span class="w-full flex gap-x-3 primary-font items-center h-fit">
    ${rating.user.first_name} ${rating.user.last_name} <span class="flex gap-x-3 h-fit items-center mb-0.5"><i class="fa-solid fa-star text-yellow-400 text-xl"></i> <p class="text-sm mt-1">${rating.rating}</p></span>
    </span>
    <p class="text-sm secondary-font">${rating.comment ? rating.comment : "No comment"}</p>
    </div>
            `
    );

    ratingsTemplate.forEach((template) => {
      usersOpinions.innerHTML = usersOpinions.innerHTML + template;
    });
  }
}

async function getRecentRatings() {
  try {
    let response;

    if (Cookies.get("token")) {
      response = await axios.get(`https://curso-coder-backend-production.up.railway.app/api/ratings/recent`, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      response = await axios.get(`https://curso-coder-backend-production.up.railway.app/api/ratings/recent`);
    }

    compileRatings(response.data.message);
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

getRecentRatings();
