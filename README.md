# SCADA

![SCADA](https://github.com/UPocek/SCADA/blob/master/docs/Screenshot%202023-09-08%20at%2011.10.31%20PM.png)

## Idea

The goal of this project is to create a universal functional SCADA (Supervisory Control And Data Acquisition) system that can be used in any type of plant or production to automate the whole process. As the name SCADA suggests this system needs to have two parts Data Acquisition part to gather pieces of information from the field and a Supervisory Control part to make automatic decisions and to send actions to control processes automatically or with human supervision.

![Login](https://github.com/UPocek/SCADA/blob/master/docs/Screenshot%202023-09-08%20at%2011.06.33%20PM.png)

## Development

To be able to accomplish the goals we set for ourselves in this project (we talking about [Tamara Ilić](https://github.com/tamarailic) and I) we needed to use WebSockets for real-time alarm notifications and data on dashboard updates (with SignalR C# library), MongoDB NoSQL database because we needed a performant and scalable database that can handle tens of thousands of entries and fast in advanced planned query patterns and partial failures recovery which we solved by completely differentiating data acquisition and control part of the system.

![Reports](https://github.com/UPocek/SCADA/blob/master/docs/Screenshot%202023-09-08%20at%2011.11.13%20PM.png)

## Results

Results were fantastic, the application was working stable, sending WebSocket data and notifications on time even on higher loads. Space for improvement we see at separating every aspect of this app in microservice so failures in some less important parts of the system won't cause problems on vital parts, also this type of architecture will enable easier redundancy to be set up for the most important functionalities and mission-critical systems.

![Results](https://github.com/UPocek/SCADA/blob/master/docs/Screenshot%202023-09-08%20at%2011.11.21%20PM.png)
