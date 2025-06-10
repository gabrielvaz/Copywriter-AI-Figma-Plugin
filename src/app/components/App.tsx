import React, { useState, useEffect } from 'react';
import '../styles/ui.css';

function App() {
  const [toneOfVoice, setToneOfVoice] = useState('Professional');
  const [numVariations, setNumVariations] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [textNodes, setTextNodes] = useState<string[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [generatedCopy, setGeneratedCopy] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isAnyNodeSelected, setIsAnyNodeSelected] = useState(false);

  const onGenerate = () => {
    if (!apiKey) {
      console.error('API Key is required');
      setError('A chave da API é obrigatória');
      return;
    }
    if (selectedNodes.length === 0) {
      console.error('No text nodes selected');
      setError('Selecione pelo menos um bloco de texto');
      return;
    }
    setError('');
    setGeneratedCopy(Array.from({ length: numVariations }, () => 'Gerando...'));

    // Combine selected nodes into a single string separated by full stops
    const combinedText = selectedNodes.join('. ');

    console.log('Sending generate-copy message with:', {
      apiKey: apiKey.substring(0, 5) + '...',
      toneOfVoice,
      numVariations,
      specialInstructions,
      combinedText,
      selectedNodeIndices: selectedNodes.map((node) => textNodes.indexOf(node)),
    });

    parent.postMessage(
      {
        pluginMessage: {
          type: 'generate-copy',
          apiKey,
          toneOfVoice,
          numVariations,
          specialInstructions,
          combinedText,
          selectedNodeIndices: selectedNodes.map((node) => textNodes.indexOf(node)),
        },
      },
      '*'
    );
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  useEffect(() => {
    console.log('App component mounted');
    window.onmessage = (event) => {
      console.log('Received message in UI:', event.data.pluginMessage);
      const { type, message, textNodes: receivedTextNodes } = event.data.pluginMessage;
      if (type === 'generate-copy-response') {
        console.log('Generated copy:', message);
        // Split the message into variants
        const variants = message.split('\n\n').filter(Boolean);
        setGeneratedCopy(variants);
        setError('');
      } else if (type === 'generate-copy-error') {
        console.error('Error generating copy:', message);
        setError(message);
        setGeneratedCopy([]);
      } else if (type === 'update-text-nodes') {
        console.log('Received text nodes:', receivedTextNodes);
        setTextNodes(receivedTextNodes || []);
        setSelectedNodes(receivedTextNodes || []);
      }
    };
  }, []);

  useEffect(() => {
    console.log('textNodes updated:', textNodes);
  }, [textNodes]);

  useEffect(() => {
    console.log('selectedNodes updated:', selectedNodes);
    setIsAnyNodeSelected(selectedNodes.length > 0);
  }, [selectedNodes]);

  const handleCheckboxChange = (text: string) => {
    setSelectedNodes((prev) => (prev.includes(text) ? prev.filter((t) => t !== text) : [...prev, text]));
  };

  return (
    <div className="container">
      <div className="content">
        <h2>CopywriterAI</h2>
        <div className="info-banner">
          {textNodes.length > 0 ? 'Selecione o texto para reescrever:' : 'Selecione um frame para começar'}
        </div>
        <div className="debug-text">Depuração: Número de nós de texto: {textNodes.length}</div>
        {textNodes.length > 0 ? (
          <div className="form-group">
            <div className="checkbox-container">
              {textNodes.map((text, index) => (
                <div key={index} className="checkbox-group">
                  <input
                    type="checkbox"
                    id={`text-${index}`}
                    checked={selectedNodes.includes(text)}
                    onChange={() => handleCheckboxChange(text)}
                  />
                  <label htmlFor={`text-${index}`}>
                    <div className="checkbox-content">{text || 'Bloco de texto vazio'}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Nenhum texto encontrado no frame selecionado.</p>
        )}
        <div className="form-group">
          <label htmlFor="apiKey">Chave da API Gemini (do Google AI Studio):</label>
          <input id="apiKey" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="toneOfVoice">Tom de voz:</label>
          <select id="toneOfVoice" value={toneOfVoice} onChange={(e) => setToneOfVoice(e.target.value)}>
            <option value="Professional">Profissional</option>
            <option value="Casual">Casual</option>
            <option value="Formal">Formal</option>
            <option value="Informed">Informativo</option>
            <option value="Persuasive">Persuasivo</option>
            <option value="Friendly">Amigável</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="numVariations">Número de variações:</label>
          <input
            id="numVariations"
            type="number"
            min="1"
            value={numVariations}
            onChange={(e) => setNumVariations(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="specialInstructions">Instruções especiais:</label>
          <textarea
            id="specialInstructions"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="generatedCopy">Cópia gerada:</label>
          <div className="generated-copy-container">
            {generatedCopy.length > 0 ? (
              generatedCopy.map((variant, index) => (
                <div key={index} className="variant-container">
                  <h3>{variant.split(':')[0]}</h3>
                  {variant
                    .split('\n')
                    .slice(1)
                    .map((line, lineIndex) => (
                      <p key={lineIndex}>{line}</p>
                    ))}
                </div>
              ))
            ) : (
              <p>Nenhuma cópia gerada ainda.</p>
            )}
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
      <div className="button-container">
        <button id="generate" onClick={onGenerate} disabled={!isAnyNodeSelected || selectedNodes.length === 0}>
          Gerar Cópia
        </button>
        <button id="cancel" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default App;
