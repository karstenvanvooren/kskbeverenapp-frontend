
const API_URL = "http://192.168.0.10:3000";

// ==========================================
// USERS
// ==========================================

export async function registerUser(username, email, password) {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registreren mislukt.");
  }

  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Inloggen mislukt.");
  }

  return data;
}

export async function getUser(userId) {
  const response = await fetch(`${API_URL}/users/${userId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gebruiker ophalen mislukt.");
  }

  return data;
}

export async function updateUser(
  userId,
  username,
  profileImage,
  favoritePlayerId
) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      profileImage,
      favoritePlayerId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gebruiker aanpassen mislukt.");
  }

  return data;
}

// ==========================================
// PLAYERS
// ==========================================

export async function getPlayers() {
  const response = await fetch(`${API_URL}/players`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Spelers ophalen mislukt.");
  }

  return data;
}

export async function getPlayer(playerId) {
  const response = await fetch(`${API_URL}/players/${playerId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Speler ophalen mislukt.");
  }

  return data;
}

// ==========================================
// MATCHES
// ==========================================

export async function getMatches() {
  const response = await fetch(`${API_URL}/matches`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Wedstrijden ophalen mislukt.");
  }

  return data;
}

export async function getMatch(matchId) {
  const response = await fetch(`${API_URL}/matches/${matchId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Wedstrijd ophalen mislukt.");
  }

  return data;
}

// ==========================================
// NEWS
// ==========================================

export async function getNews() {
  const response = await fetch(`${API_URL}/news`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nieuws ophalen mislukt.");
  }

  return data;
}

export async function getNewsArticle(newsId) {
  const response = await fetch(`${API_URL}/news/${newsId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Nieuwsartikel ophalen mislukt."
    );
  }

  return data;
}

// ==========================================
// COMMENTS
// ==========================================

export async function getComments(newsId) {
  const response = await fetch(
    `${API_URL}/comments/news/${newsId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Comments ophalen mislukt.");
  }

  return data;
}

export async function addComment(newsId, userId, content) {
  const response = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      newsId,
      userId,
      content,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Comment plaatsen mislukt.");
  }

  return data;
}

export async function deleteComment(commentId) {
  const response = await fetch(
    `${API_URL}/comments/${commentId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Comment verwijderen mislukt.");
  }

  return data;
}

// ==========================================
// MAN OF THE MATCH
// ==========================================

export async function getMomVotes(matchId) {
  const response = await fetch(
    `${API_URL}/mom-votes/match/${matchId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Stemmen ophalen mislukt.");
  }

  return data;
}

export async function getMomResults(matchId) {
  const response = await fetch(
    `${API_URL}/mom-votes/match/${matchId}/results`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Stemresultaten ophalen mislukt."
    );
  }

  return data;
}

export async function voteForMom(matchId, playerId, userId) {
  const response = await fetch(`${API_URL}/mom-votes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      matchId,
      playerId,
      userId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Stemmen mislukt.");
  }

  return data;
}