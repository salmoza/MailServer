package com.example.backend.services.userService;

public abstract class AuthHandler {
    private AuthHandler next;

    public AuthHandler setNext(AuthHandler next){
        this.next = next;
        return next;
    }

    public final void handle(Request request) {
        validate(request);
        if (next != null) {
            next.handle(request);
        }
    }
    protected abstract void validate(Request request);

//    protected Object checkNext(Request request) {
//        if (next == null) return null;
//        return next.handle(request);
//    }
}

