
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
        let tableContents = document.getElementById('table-contents');
        tableContents.innerHTML = ''

        // make book div with id 'book' + libIndex
        for(let libIndex = 0; libIndex < myLibrary.length; libIndex++) {
            let bookDiv = document.createElement('div');
            bookDiv.setAttribute('id',`book_${libIndex}`);
            bookDiv.setAttribute('class','book-details');
            // in each div, make a p element with id of property + libIndex
            // ex: title0, author0, title1, author1

            for (let prop in myLibrary[libIndex]) {
                let propElement = document.createElement('p');
                propElement.setAttribute('id',`${prop}_${libIndex}`);
                propElement.setAttribute('class',`detail`);
                if (prop === 'isRead') {
                    propElement.textContent = myLibrary[libIndex][prop] ? 'Y' : 'N';
                } else {
                    propElement.textContent = myLibrary[libIndex][prop];
                }
                bookDiv.appendChild(propElement);
            }

            // need buttons for each book that will remove the book
            let removeButton = document.createElement('button');
            removeButton.textContent = 'X';
            removeButton.setAttribute('id', `remove_${libIndex}`);
            removeButton.setAttribute('class','remove c6');
            bookDiv.appendChild(removeButton);

            tableContents.appendChild(bookDiv);


        }

        // add listener events to all change & remove buttons
        addReadStatusToggle();
        addRemoveButtonListener();

        addLibraryToLocalStorage();
    }

    function addReadStatusToggle() {
        const isReadBoxes = document.querySelectorAll('[id^="isRead"]');
        for (let bookIndex = 0; bookIndex < isReadBoxes.length; bookIndex++) {
            isReadBoxes[bookIndex].addEventListener('click', function() {
                changeStatus(bookIndex);
            });
        }
    }

    function addRemoveButtonListener() {
        const removeButtons = document.getElementsByClassName('remove');
        for (let bookIndex = 0; bookIndex < removeButtons.length; bookIndex++) {
            removeButtons[bookIndex].addEventListener('click', () => removeBook(bookIndex));
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
        myLibrary[id].isRead = !myLibrary[id].isRead;
        displayBooks(myLibrary);
    }

    function removeBook(id) {
        myLibrary = myLibrary.slice(0,id).concat(myLibrary.slice(id+1));
        displayBooks(myLibrary);
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

