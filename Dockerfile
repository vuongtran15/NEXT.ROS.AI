# Use Node.js 22.14.0 as the base image
FROM node:22.14.0

# Set working directory
WORKDIR /app

RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/vuongtran15/NEXT.ROS.AI.git ./

# remove .next folder
RUN rm -rf ./.next

RUN npm install



# Expose the port the app runs on
EXPOSE 3000

CMD ["npm", "run", "dev:https"]