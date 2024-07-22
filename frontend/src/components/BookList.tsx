import React, { useEffect, useState } from "react";
import axios from "axios";

interface Book {
  _id: number;
  title: string;
  author: string;
  available: boolean;
  bookBorrowed: boolean;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [editing, setEditing] = useState<boolean>(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_APP_URL
        }/user/books/available?userId=${localStorage.getItem("userId")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/user/add`,
        { title, author },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBooks([...books, response.data]);
      setTitle("");
      setAuthor("");
      fetchBooks();
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const handleEditBook = async () => {
    if (currentBook) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_APP_URL}/user/update/${currentBook._id}`,
          { title, author },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const updatedBooks = books.map((book) =>
          book._id === currentBook._id ? response.data : book
        );
        setBooks(updatedBooks);
        setTitle("");
        setAuthor("");
        setEditing(false);
        setCurrentBook(null);
        fetchBooks();
      } catch (error) {
        console.error("Error editing book:", error);
      }
    }
  };

  const handleDeleteBook = async (id: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_APP_URL}/user/delete/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      setBooks(books.filter((book) => book._id !== id));
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleEditClick = (book: Book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setEditing(true);
    setCurrentBook(book);
    fetchBooks();
  };
  const handleBorrowBook = async (bookId: Number) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_URL}/user/borrow`,
        {
          userId: localStorage.getItem("userId"),
          bookId: bookId,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );
      fetchBooks();
    } catch (error) {
      console.error("Error Borrow book:", error);
    }
  };
  const handleReturnBook = async (bookId: Number) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_URL}/user/return`,
        {
          userId: localStorage.getItem("userId"),
          bookId: bookId,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );
      fetchBooks();
    } catch (error) {
      console.error("Error Returning book:", error);
    }
  };

  return (
    <div>
      <h1>Book List</h1>
      <div className="flex  flex-col gap-y-4">
        {localStorage.getItem("role") === "admin" ? (
          <>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {editing ? (
              <button
                onClick={handleEditBook}
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Update Book
              </button>
            ) : (
              <button
                onClick={handleAddBook}
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Add Book
              </button>
            )}
          </>
        ) : (
          ""
        )}
      </div>
      <table className="mt-2">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            {localStorage.getItem("role") === "admin" && <th>Actions</th>}
            {localStorage.getItem("role") !== "admin" && <th>Borrow/Return</th>}
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              {localStorage.getItem("role") === "admin" ? (
                <td className="flex gap-x-2">
                  <button
                    className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                    onClick={() => handleEditClick(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    onClick={() => handleDeleteBook(book._id)}
                  >
                    Delete
                  </button>
                </td>
              ) : (
                <td>
                  {book.bookBorrowed && !book.available ? (
                    <button
                      className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                      onClick={() => handleReturnBook(book._id)}
                    >
                      Return
                    </button>
                  ) : !book.available ? (
                    <p>Book Borrowed By another user</p>
                  ) : (
                    <button
                      className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                      onClick={() => handleBorrowBook(book._id)}
                    >
                      Borrow
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
