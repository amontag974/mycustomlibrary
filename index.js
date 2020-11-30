
// create constructor to create book objects
function library() {


    document.getElementById('new-book-btn').addEventListener('click', function() {
        createNewBookForm();
    });

    // create array that will contain all book objects
    let myLibrary = getLibrary();

    function getLibrary() {
        const exampleBook = new Book('Example Book', 'Example Author', 100, true);
        const localStorageLibraryExists = checkIfStorageLibraryExists();

        if (localStorageLibraryExists) {
            const library = JSON.parse(localStorage.myCustomLibrary)
            return library;
        }
        return [exampleBook];
    }

    function checkIfStorageLibraryExists() {
        if (localStorage.myCustomLibrary && localStorage.myCustomLibrary !== "[]") { return true }
        return false;
    }

    // loop through array and display on page
    function displayBooks(myLibrary) {
        let bookContainer = document.getElementsByClassName('book-container')[0];
        bookContainer.innerHTML = ''

        // make book div with id 'book' + libIndex
        for(let libIndex = 0; libIndex < myLibrary.length; libIndex++) {
            let currentBook = myLibrary[libIndex]
            let bookCard = document.createElement('div');
            bookCard.setAttribute('id',`book_${libIndex}`);

            //determines card color based on read status
            currentBook.isRead ? bookCard.setAttribute('class', 'read') : bookCard.setAttribute('class', 'unread');

            let bookDetailElements = createBookDetailElements(currentBook, libIndex);
            bookDetailElements.forEach(element => {
                bookCard.appendChild(element);
            });

            // need button for each book that will remove the book
            let removeIcon = createRemoveIcon(libIndex);
            bookCard.appendChild(removeIcon);

            bookContainer.appendChild(bookCard);
        }

        // add listener events to all change & remove buttons
        addReadStatusToggle();
        addRemoveButtonListener();

        addLibraryToLocalStorage();
    }

    function createBookDetailElements(book, index) {
        const bookDetailElements = [];

        for(let prop in book) {
            let propElement = document.createElement('p');
            propElement.setAttribute('id',`${prop}_${index}`);
            propElement.setAttribute('class',`detail`);

            switch(prop) {
                case "title":
                    propElement.textContent = book[prop];
                    break;
                case "author": 
                    propElement.textContent = `By ${book[prop]}`
                    break;
                case "pageCount":
                    propElement.textContent = `${book[prop]} pages`;
                    break;
                case "isRead":
                    break;
            }

            bookDetailElements.push(propElement);
        }

        return bookDetailElements;
    }

    function createRemoveIcon(index) {
        let removeIcon = document.createElement('span');
        removeIcon.innerHTML = `&#10006;`;
        removeIcon.setAttribute('id', `remove_${index}`);
        
        return removeIcon;
    }

    function addReadStatusToggle() {
        const books = document.querySelectorAll('[id^="book_"]');
        for (let bookIndex = 0; bookIndex < books.length; bookIndex++) {
            books[bookIndex].addEventListener('click', function() {
                changeStatus(bookIndex);
            });
        }
    }

    function addRemoveButtonListener() {
        const removeButtons = document.querySelectorAll('[id^="remove_"]');
        for (let bookIndex = 0; bookIndex < removeButtons.length; bookIndex++) {
            removeButtons[bookIndex].addEventListener('click', (e) => {
                removeBook(bookIndex);
                e.stopPropagation();
            });
        }
    }

    function addBook(e) {
        e.preventDefault();

        const newBook = new Book(
            document.getElementById('new-title').value,
            document.getElementById('new-author').value,
            document.getElementById('new-pageCount').value,
            document.getElementById('new-isRead').checked
        )

        myLibrary.push(newBook);

        displayBooks(myLibrary);

        //remove book form
        document.getElementById('book-form').remove();

        //display create button
        document.getElementById('new-book-btn').classList.remove('hidden');
    }

    function changeStatus(id) {
        if (myLibrary.length > 0) {
            myLibrary[id].isRead = !myLibrary[id].isRead;
            displayBooks(myLibrary);
        }
    }

    function removeBook(id) {
        if (myLibrary.length > 0) {
            myLibrary = myLibrary.slice(0,id).concat(myLibrary.slice(id+1));
            displayBooks(myLibrary);
        }
    }

    function createNewBookForm() {
        let newBookForm = document.createElement('form');
        newBookForm.setAttribute('id', 'book-form');

        //creates inputs for form
        newBookForm.appendChild(createTitleInput());
        newBookForm.appendChild(createAuthorInput());
        newBookForm.appendChild(createPageCountInput());
        newBookForm.appendChild(createIsReadCheckbox());
        newBookForm.appendChild(createAddButton());

        //hide create button
        document.getElementById('new-book-btn').classList.add('hidden');

        // add new form
        const target = document.getElementById('new-book-form');
        target.appendChild(newBookForm);

        //provide add button functionality
        newBookForm.addEventListener('submit', addBook);
    }

    function createTitleInput() {
        let titleContainer = document.createElement('div');
        let titleLabel = document.createElement('label');
        let titleInput = document.createElement('input');

        titleLabel.innerHTML = "Book Title";
        titleLabel.setAttribute('class', 'form-label');

        titleInput.setAttribute('id', 'new-title');
        titleInput.setAttribute('type','text');
        titleInput.required = true;

        titleContainer.setAttribute('class','book-form-input-container');
        titleContainer.appendChild(titleLabel);
        titleContainer.appendChild(titleInput);
        return titleContainer;
    }

    function createAuthorInput() {
        let authorContainer = document.createElement('div');
        let authorLabel = document.createElement('label');
        let authorInput = document.createElement('input');

        authorLabel.innerText = "Author";
        authorLabel.setAttribute('class', 'form-label');
        
        authorInput.setAttribute('id', 'new-author');
        authorInput.setAttribute('type','text');
        authorInput.required = true;

        authorContainer.setAttribute('class','book-form-input-container');
        authorContainer.appendChild(authorLabel);
        authorContainer.appendChild(authorInput);
        return authorContainer;
    }

    function createPageCountInput() {
        let pageCountContainer = document.createElement('div');
        let pageCountLabel = document.createElement('label');
        let pageCountInput = document.createElement('input');

        pageCountLabel.innerText = "Page Count";
        pageCountLabel.setAttribute('class', 'form-label');

        pageCountInput.setAttribute('id', 'new-pageCount');
        pageCountInput.setAttribute('type','number');
        pageCountInput.required = true;

        pageCountContainer.setAttribute('class','book-form-input-container');
        pageCountContainer.appendChild(pageCountLabel);
        pageCountContainer.appendChild(pageCountInput);
        return pageCountContainer;
    }

    function createIsReadCheckbox() {
        let isReadContainer = document.createElement('div');
        let isReadLabel = document.createElement('label');
        let isReadCheckbox = document.createElement('input');

        isReadLabel.innerText = "Read (check)";
        isReadLabel.setAttribute('class', 'form-label');

        isReadCheckbox.setAttribute('id', 'new-isRead');
        isReadCheckbox.setAttribute('type','checkbox');

        isReadContainer.setAttribute('class','book-form-input-container');
        isReadContainer.appendChild(isReadLabel);
        isReadContainer.appendChild(isReadCheckbox);
        return isReadContainer;
    }

    function createAddButton() {
        let addButton = document.createElement('button');
        addButton.setAttribute('id','add-button');
        addButton.setAttribute('type', 'submit');
        addButton.textContent= 'Add';
        return addButton;
    }

    function addLibraryToLocalStorage() {
        localStorage.myCustomLibrary = stringifyLibrary(myLibrary);
    }

    function stringifyLibrary(myLibrary) {
        return JSON.stringify(myLibrary);
    }

    displayBooks(myLibrary);
}

class Book {
    constructor(title, author, pageCount, isRead) {
        this.title = title;
        this.author = author;
        this.pageCount = pageCount;
        this.isRead = isRead;     
    }
}

library();

