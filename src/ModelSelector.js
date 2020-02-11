import React, { Component } from 'react'
import { InputLabel,Select,MenuItem } from '@material-ui/core'
export default class ModelSelector extends Component {
    render() {
        return (
            <div>
                <InputLabel id="model-label">Model</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.value}
                    onChange={this.props.onChange}
                >
                    {
                        this.props.models.map(model => {
                            return (
                                <MenuItem key={model} value={model}>{model}</MenuItem>
                            )
                        })
                    }
                </Select>
            </div>
        )
    }
}
