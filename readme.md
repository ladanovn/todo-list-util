## todo-list-util
The utility will take all files with the .js extension in the current directory, find all comments with TODO in them. Search by them, filter, sort.

For start `node index.js`		
Todo format:					

- // TODO ...	     

- // TODO: ...	   	

- // TODO {author}; {date}; {comment}	   	


Command

1. exit
2. show : get all todos
3. important : todos with ! in comment
4. user {username}
For example, "user veronika"
5. sort {importance | user | date}
For example, "sort importance", "sort user", "sort date"
6. date {yyyy[-mm-dd]}
