import React from 'react';
import { Card, Button, Icon, Label } from 'semantic-ui-react';

// JobSummaryCard Component
export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this);
        this.copyJob = this.copyJob.bind(this); 
    }

    selectJob(id) {
        // Logic to handle selecting a job (Close/Edit/Copy)
        console.log(`Selected job ID: ${id}`);
    }

    copyJob(job) {
        // Logic to copy job details
        const jobDetails = `
            Title: ${job.title}
            Location: ${job.location.city}, ${job.location.country}
            Summary: ${job.summary}
        `;
        navigator.clipboard.writeText(jobDetails)
            .then(() => {
                console.log('Job details copied to clipboard');
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    }

    render() {
        const { job } = this.props;
        const isExpired = job.status === 0;

        return (
            <Card className="job-summary-card">
                <Card.Content>
                    <Card.Header>
                        {job.title}
                        {/* Candidate Suggestions */}
                        <Label
                            as='a'
                            color='black'
                            ribbon='right'
                            className="candidate-count"
                            size="mini"
                        >
                            <Icon name='user' /> {job.noOfSuggestions || 0}
                        </Label>
                    </Card.Header>
                    <Card.Meta>
                        {job.location.city}, {job.location.country}
                    </Card.Meta>
                    <Card.Description>
                        {job.summary}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className="button-container">
                        {/* Job Status */}
                        {isExpired && (
                            <Button color='red' size='tiny' className="expired-btn">
                                Expired
                            </Button>
                        )}
                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <Button className="action-button" basic color='blue' size='mini' onClick={() => this.selectJob(job.id)}>
                                Close
                            </Button>
                            <Button className="action-button" basic color='blue' size='mini' onClick={() => this.selectJob(job.id)}>
                                Edit
                            </Button>
                            <Button className="action-button" basic color='blue' size='mini' onClick={() => this.copyJob(job)}>
                                Copy
                            </Button>
                        </div>
                    </div>
                </Card.Content>
            </Card> 
        );
    }
}

export default JobSummaryCard;
