const gerUsername = document.querySelector("#user") as HTMLInputElement;
const formSubmit = document.querySelector(".form") as HTMLFormElement;
const main_container = document.querySelector(".main_container") as HTMLElement;
const loadingIndicator = document.querySelector("#loading") as HTMLElement;

// Defining the structure of user data
interface UserData {
    id: number;
    login: string;
    avatar_url: string;
    location: string;
    url: string;
}

// Store fetched user data globally to avoid refetching every time
let allUsers: UserData[] = [];

// Custom fetch function to get data from the API
async function myCustomFetch<T>(url: string, option?: RequestInit): Promise<T> {
    const response = await fetch(url, option);
    if (!response.ok) {
        throw new Error(`Error fetching data - status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

// Show a single user's information on the page with fade-in animation
const showResultUI = (singleUser: UserData) => {
    const userCard = document.createElement('div');
    userCard.classList.add('card');
    userCard.innerHTML = `
        <img src=${singleUser.avatar_url} alt=${singleUser.login}/>
        <hr/>
        <div class='card-footer'>
            <img src=${singleUser.avatar_url} alt=${singleUser.login}/>
            <div>
                <p class="login">${singleUser.login}</p>
                <a href=${singleUser.url} target="_blank">GitHub</a>
            </div>
        </div>
    `;
    // Animate the card with a fade-in effect
    main_container.appendChild(userCard);
    setTimeout(() => {
        userCard.classList.add('fade-in');
    }, 100);
};

// Function to fetch user data and store it globally
async function fetchUserData(url: string) {
    try {
        loadingIndicator.style.display = 'block'; // Show loading indicator
        const userInfo = await myCustomFetch<UserData[]>(url, {});
        allUsers = userInfo;
        main_container.innerHTML = ''; // Clear previous results
        userInfo.forEach((singleUser) => showResultUI(singleUser));
    } catch (error) {
        console.error("Error fetching users:", error);
    } finally {
        loadingIndicator.style.display = 'none'; // Hide loading indicator
    }
}

// Initial load: Fetch users
fetchUserData("https://api.github.com/users");

// Event listener for form submission
formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchParson = gerUsername.value.toLowerCase();

    // If no search term is entered, show all users
    if (!searchParson) {
        main_container.innerHTML = "";
        allUsers.forEach((user) => showResultUI(user));
        return;
    }

    // Clear previous search results
    main_container.innerHTML = "";

    // Filter users based on the search term
    const matchingUser = allUsers.filter((user) =>
        user.login.toLowerCase().includes(searchParson)
    );

    // Display filtered results or show a "no matching users" message with animation
    if (matchingUser.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.classList.add('empty-msg');
        emptyMessage.textContent = 'No matching users found.';
        main_container.appendChild(emptyMessage);
        setTimeout(() => {
            emptyMessage.classList.add('fade-in');
        }, 100);
    } else {
        matchingUser.forEach((user) => {
            showResultUI(user);
        });
    }
});
