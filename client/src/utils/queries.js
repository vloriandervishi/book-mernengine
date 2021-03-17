import gql from  'graphql-tag';

export const BOOK_Library= gql`{
   
       me {
           _id
           username
           email
           bookCount
           savedBooks {
               bookId
               authors
               title
               description
               image 
               link
           }
       }
    }
`;