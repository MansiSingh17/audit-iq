.PHONY: start stop test clean

start:
	@./start-dev.sh

stop:
	@./stop-dev.sh

test:
	@cd backend/spring-boot-service && mvn test
	@cd frontend/react-app && npm test

clean:
	@mvn clean
	@rm -rf node_modules
	@rm -rf backend/spring-boot-service/target

install:
	@cd backend/spring-boot-service && mvn install
	@cd frontend/react-app && npm install
	@cd backend/python-ml-service && pip install -r requirements.txt
