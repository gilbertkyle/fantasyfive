FROM public.ecr.aws/lambda/python:3.11

# Copy requirements.txt
COPY requirements.txt ${LAMBDA_TASK_ROOT}

# install linux dependencies for nfl_data_py
RUN yum install gcc gcc-c++ snappy-devel -y

# Install the specified packages
RUN pip install -r requirements.txt

# Copy function code
COPY lambda.py ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "lambda.handler" ]

