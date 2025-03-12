import React from 'react';
import { useConnection } from '../../contexts/ConnectionContext.tsx';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.tsx';
import { Label } from '../ui/label.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.tsx';
import { Slider } from '../ui/slider.tsx';
import { Button } from '../ui/button.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion.tsx';
import { Loader2 } from 'lucide-react';

const SettingsPanel = () => {
    const {
        isConnected,
        isConnecting,
        models,
        selectedModel,
        temperature,
        maxTokens,
        connectionError,
        connectToAPI,
        disconnectFromAPI,
        setModelParameter
    } = useConnection();

    const handleConnect = () => {
        if (isConnected) {
            disconnectFromAPI();
        } else {
            connectToAPI();
        }
    };

    const getConnectionStatusClassName = () => {
        if (isConnecting) return 'bg-slate-100 text-slate-600';
        return isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    };

    const getConnectionStatusText = () => {
        if (isConnecting) return 'Connecting...';
        return isConnected ? 'Connected to LLM API' : 'Disconnected';
    };

    const handleTemperatureChange = (value) => {
        setModelParameter('temperature', value[0]);
    };

    const handleMaxTokensChange = (e) => {
        setModelParameter('maxTokens', parseInt(e.target.value));
    };

    return (
        <div className="w-full md:w-1/3 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Connection Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="model-select">Model</Label>
                        <Select
                            disabled={!isConnected}
                            value={selectedModel || ''}
                            onValueChange={(value) => setModelParameter('selectedModel', value)}
                        >
                            <SelectTrigger id="model-select">
                                <SelectValue placeholder="Select a model" />
                            </SelectTrigger>
                            <SelectContent>
                                {models.length === 0 ? (
                                    <SelectItem value="no-models">No Models detected</SelectItem>
                                ) : (
                                    models.map((model) => (
                                        <SelectItem key={model.id} value={model.id}>
                                            {model.id}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label htmlFor="temperature">Temperature: {temperature}</Label>
                        </div>
                        <Slider
                            id="temperature"
                            min={0}
                            max={1}
                            step={0.1}
                            value={[temperature]}
                            onValueChange={handleTemperatureChange}
                        />
                        <p className="text-sm text-slate-500 italic">
                            Controls randomness: Lower values (0.0) make responses more focused and deterministic,
                            while higher values (1.0) make responses more creative and diverse.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="max-tokens">Max Tokens</Label>
                        <input
                            type="number"
                            id="max-tokens"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={maxTokens}
                            min="1"
                            max="8192"
                            onChange={handleMaxTokensChange}
                        />
                        <p className="text-sm text-slate-500 italic">
                            Maximum number of tokens (words/characters) in the response.
                            Higher values allow for longer responses but may take longer to generate.
                        </p>
                    </div>

                    <Button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className="w-full"
                        variant={isConnected ? "destructive" : "default"}
                    >
                        {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isConnected ? 'Disconnect' : 'Connect to DeepSeek'}
                    </Button>

                    <div className={`p-3 rounded-md text-center ${getConnectionStatusClassName()}`}>
                        {getConnectionStatusText()}
                        {connectionError && <div className="text-red-500 mt-2 text-sm">{connectionError}</div>}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Model Info</CardTitle>
                </CardHeader>
                <CardContent>
                    {isConnected ? (
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Model Details</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-2">
                                        <p><strong>Available Models:</strong> {models.length}</p>
                                        <p><strong>Selected Model:</strong> {selectedModel}</p>
                                        <p><strong>Status:</strong> Ready</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ) : (
                        <p className="text-slate-500">Connect to see model information</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsPanel;