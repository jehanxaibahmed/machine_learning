import * as React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
export default function PermissionsGrid({ key1, key2, permissions , handleChange}) {
    const [loading, setLoading] = React.useState(false);
    return (
        <Card>
            <CardBody>
                <FormGroup row>
                    {Object.keys(permissions[key1][key2]).map((sub_key, index) => (
                        sub_key != "name" && sub_key != "enable" &&  
                        <FormControlLabel
                            control={<Checkbox
                            checked={permissions[key1][key2][sub_key].enable}
                            onChange={()=>handleChange(key1,key2,sub_key)}
                            name={sub_key}
                            />}
                            label={permissions[key1][key2][sub_key]?.name}
                        />
                    ))}
                </FormGroup>
            </CardBody>

        </Card>

    );
}