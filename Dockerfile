FROM node:16

# Set the timezone
ENV TZ=Asia/Bangkok
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set working directory
WORKDIR /opt/Testhosting_3-app

# Add package.json and package-lock.json
COPY package.json package-lock.json /opt/Testhosting_3-app/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . /opt/Testhosting_3-app

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
