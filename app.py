import strawberry
from typing import Optional

from fastapi import FastAPI
from sqlalchemy import select
from strawberry.fastapi import GraphQLRouter
from strawberry.types import Info
from strawberry.dataloader import DataLoader

import models

@strawberry.type
class Author:
    id: strawberry.ID
    name: str

    @strawberry.field
    async def books(self, info: Info) -> list["Book"]:
        books = await info.context["books_by_author"].load(self.id)
        return [Book.marshal(book) for book in books]

    @classmethod
    def marshal(cls, model: models.Author) -> "Author":
        return cls(id=strawberry.ID(str(model.id)), name=model.name)


@strawberry.type
class Book:
    id: strawberry.ID
    name: str
    author: Optional[Author] = None

    @classmethod
    def marshal(cls, model: models.Book) -> "Book":
        return cls(
            id=strawberry.ID(str(model.id)),
            name=model.name,
            author=Author.marshal(model.author) if model.author else None,
        )

@strawberry.type
class AuthorExists:
    message: str = "Author with this name already exist"

@strawberry.type
class AuthorNotFound:
    message: str = "Couldn't find an author with the supplied name"

@strawberry.type
class AuthorNameMissing:
    message: str = "Please supply an author name"

AddBookResponse = strawberry.union("AddBookResponse", (Book, AuthorNotFound, AuthorNameMissing))
AddAuthorResponse = strawberry.union("AddAuthorResponse", (Author, AuthorExists))


all_tasks: list = []

@strawberry.type
class Query:
    @strawberry.field
    async def books(self) -> list[Book]:
        async with models.get_session() as s:
            sql = select(models.Book).order_by(models.Book.name)
            db_book = (await s.execute(sql)).scalars().unique().all()
        return [Book.marshal(book) for book in db_book]

    @strawberry.field
    async def authors(self) -> list[Author]:
        async with models.get_session() as s:
            sql = select(models.Author).order_by(models.Author.name)
            db_authors = (await s.execute(sql)).scalars().unique().all()
        return [Author.marshal(loc) for loc in db_authors]


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def add_book(self, name: str, author_name: Optional[str]) -> AddBookResponse:
        async with models.get_session() as s:
            db_author = None
            if author_name:
                sql = select(models.Author).where(models.Author.name == author_name)
                db_author = (await s.execute(sql)).scalars().first()
                if not db_author:
                    return AuthorNotFound()
            else:
                return AuthorNameMissing()
            db_book = models.Book(name=name, author=db_author)
            s.add(db_book)
            await s.commit()
        return Book.marshal(db_book)

    @strawberry.mutation
    async def add_author(self, name: str) -> AddAuthorResponse:
        async with models.get_session() as s:
            sql = select(models.Author).where(models.Author.name == name)
            existing_db_author = (await s.execute(sql)).first()
            if existing_db_author is not None:
                return AuthorExists()
            db_author = models.Author(name=name)
            s.add(db_author)
            await s.commit()
        return Author.marshal(db_author)


async def load_books_by_author(keys: list) -> list[Book]:
    async with models.get_session() as s:
        all_queries = [select(models.Book).where(models.Book.author_id == key) for key in keys]
        data = [(await s.execute(sql)).scalars().unique().all() for sql in all_queries]
        print(keys, data)
    return data


async def load_author_by_book(keys: list) -> list[Book]:
    async with models.get_session() as s:
        sql = select(models.Author).where(models.Author.id in keys)
        data = (await s.execute(sql)).scalars().unique().all()
    if not data:
        data.append([])
    return data


async def get_context() -> dict:
    return {
        "author_by_book": DataLoader(load_fn=load_author_by_book),
        "books_by_author": DataLoader(load_fn=load_books_by_author),
    }

schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQLRouter(schema, context_getter=get_context)

app = FastAPI()
app.include_router(graphql_app, prefix="/graphql")