import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { TagsWidget } from './fields/TagsField';

const customWidgets = {
    tags: TagsWidget
};

const customFields = {};

/**
 * A generic JSON Schema form component.
 * 
 * @param {Object} props
 * @param {Object} props.schema - JSON Schema definitions
 * @param {Object} props.formData - The data object to edit
 * @param {Function} props.onChange - Handler for data changes (e.formData)
 * @param {Function} props.onSubmit - Handler for form submission
 * @param {Object} props.uiSchema - Optional UI Schema
 * @param {Object} props.fields - Optional custom fields
 * @param {Object} props.widgets - Optional custom widgets
 */
export default function SchemaForm({
    schema,
    formData,
    onChange,
    onSubmit,
    uiSchema,
    fields = {},
    widgets = {},
    children
}) {
    return (
        <div className="schema-form-wrapper">
            <Form
                schema={schema}
                formData={formData}
                validator={validator}
                onChange={onChange}
                onSubmit={onSubmit}
                uiSchema={uiSchema}
                fields={{ ...customFields, ...fields }}
                widgets={{ ...customWidgets, ...widgets }}
                className="rjsf-tailwind-overrides"
                liveValidate={true}
                showErrorList={false}
            >
                {children || <button type="submit" className="hidden">Submit</button>}
            </Form>
        </div>
    );
}
