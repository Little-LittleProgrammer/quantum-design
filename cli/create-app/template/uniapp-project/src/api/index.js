import { get } from './http';

export function api_index(body = {}) {
    return get('/v1/books/home', body, { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzX2F0IjotMSwiaWQiOjQyNjc5ODI0NTExNzY5MDAwNSwiaXNzdWVkX2F0IjoxNjYzOTIxMTc3LCJpc3N1ZXIiOiJuZXctbWVkaWEiLCJhY2NvdW50X2lkIjo2ODIsInVzZXJfaWQiOjQyNjc4ODcxNzQ3MDk0MTM0OSwiZGV2aWNlX2lkIjoiMzE3ODM2M2EyMDUxYjYzZDBlMGYxYjU0YmJkODYwZjFlYWEyYTg0N2U4NDI2ZGYwM2YwYzhkOTg5MzZmZTk0NSIsInJvbGUiOiJ2aXNpdG9yIiwidmlwX2V4cGlyZV9hdCI6MH0.MsrM7zJWoPfp9SxJBbqA3QOCOZbbPj1ovJ6KRXdeqD4' });
}
