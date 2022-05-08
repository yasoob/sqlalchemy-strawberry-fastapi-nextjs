import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddAuthorResponse = Author | AuthorExists;

export type AddBookResponse = AuthorNameMissing | AuthorNotFound | Book;

export type Author = {
  __typename?: 'Author';
  books: Array<Book>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type AuthorExists = {
  __typename?: 'AuthorExists';
  message: Scalars['String'];
};

export type AuthorNameMissing = {
  __typename?: 'AuthorNameMissing';
  message: Scalars['String'];
};

export type AuthorNotFound = {
  __typename?: 'AuthorNotFound';
  message: Scalars['String'];
};

export type Book = {
  __typename?: 'Book';
  author?: Maybe<Author>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addAuthor: AddAuthorResponse;
  addBook: AddBookResponse;
};


export type MutationAddAuthorArgs = {
  name: Scalars['String'];
};


export type MutationAddBookArgs = {
  authorName?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  authors: Array<Author>;
  books: Array<Book>;
};

export type BooksQueryVariables = Exact<{ [key: string]: never; }>;


export type BooksQuery = { __typename?: 'Query', books: Array<{ __typename?: 'Book', id: string, name: string, author?: { __typename?: 'Author', name: string } | null }> };

export type AuthorsQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthorsQuery = { __typename?: 'Query', authors: Array<{ __typename?: 'Author', id: string, name: string }> };

export type BookFieldsFragment = { __typename?: 'Book', id: string, name: string, author?: { __typename?: 'Author', name: string } | null };

export type AuthorFieldsFragment = { __typename?: 'Author', id: string, name: string };

export type AddBookMutationVariables = Exact<{
  name: Scalars['String'];
  authorName: Scalars['String'];
}>;


export type AddBookMutation = { __typename?: 'Mutation', addBook: { __typename: 'AuthorNameMissing' } | { __typename: 'AuthorNotFound' } | { __typename: 'Book', id: string, name: string, author?: { __typename?: 'Author', name: string } | null } };

export type AddAuthorMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type AddAuthorMutation = { __typename?: 'Mutation', addAuthor: { __typename: 'Author', id: string, name: string } | { __typename: 'AuthorExists', message: string } };

export const BookFieldsFragmentDoc = gql`
    fragment BookFields on Book {
  id
  name
  author {
    name
  }
}
    `;
export const AuthorFieldsFragmentDoc = gql`
    fragment AuthorFields on Author {
  id
  name
}
    `;
export const BooksDocument = gql`
    query Books {
  books {
    ...BookFields
  }
}
    ${BookFieldsFragmentDoc}`;

export function useBooksQuery(options?: Omit<Urql.UseQueryArgs<BooksQueryVariables>, 'query'>) {
  return Urql.useQuery<BooksQuery>({ query: BooksDocument, ...options });
};
export const AuthorsDocument = gql`
    query Authors {
  authors {
    ...AuthorFields
  }
}
    ${AuthorFieldsFragmentDoc}`;

export function useAuthorsQuery(options?: Omit<Urql.UseQueryArgs<AuthorsQueryVariables>, 'query'>) {
  return Urql.useQuery<AuthorsQuery>({ query: AuthorsDocument, ...options });
};
export const AddBookDocument = gql`
    mutation AddBook($name: String!, $authorName: String!) {
  addBook(name: $name, authorName: $authorName) {
    __typename
    ... on Book {
      __typename
      ...BookFields
    }
  }
}
    ${BookFieldsFragmentDoc}`;

export function useAddBookMutation() {
  return Urql.useMutation<AddBookMutation, AddBookMutationVariables>(AddBookDocument);
};
export const AddAuthorDocument = gql`
    mutation AddAuthor($name: String!) {
  addAuthor(name: $name) {
    __typename
    ... on AuthorExists {
      __typename
      message
    }
    ... on Author {
      __typename
      ...AuthorFields
    }
  }
}
    ${AuthorFieldsFragmentDoc}`;

export function useAddAuthorMutation() {
  return Urql.useMutation<AddAuthorMutation, AddAuthorMutationVariables>(AddAuthorDocument);
};