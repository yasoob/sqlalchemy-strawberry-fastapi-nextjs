This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It demonstrates how to use Strawberry, FastAPI, SQLAlchemy, and NextJS together. It makes use of `graphql-codegen` to automatically generate `urql` hooks based on GraphQL API that are ready to use in your React/NextJS code.


## Getting Started

First, install the Python dependencies:

```
$ pip install -r requirements.txt
```

Next, install the npm based dependencies:

```
$ npm install
```

Create the db:

```
$ python models.py
```

Now, run the `uvicorn` server:

```
$ uvicorn app:app --reload --host '::'
```

Finally, run the NextJS development server:

```bash
npm run dev
# or
yarn dev
```

Now you can go to `http://127.0.0.1:3000/graphql` to explore the interactive GraphiQL app and start developing your NextJS app.