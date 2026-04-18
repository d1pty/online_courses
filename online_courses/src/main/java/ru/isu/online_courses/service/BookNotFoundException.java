
package ru.isu.online_courses.service;


public class BookNotFoundException extends RuntimeException{
    public BookNotFoundException(String message) {
        super(message);
    }       
}
