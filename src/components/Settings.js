import React from 'react';
import styled from 'styled-components';
import { useSettings } from '../context/SettingsContext';

const SettingsButton = styled.button`
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px var(--shadow-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  transition: all var(--transition-speed) ease;
  color: var(--text-color);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px var(--shadow-color);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const SettingsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all var(--transition-speed) ease;
`;

const ModalContent = styled.div`
  background-color: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 10px 40px var(--shadow-color);
  width: calc(min(90%, 600px));
  max-height: 90vh;
  overflow-y: auto;
  padding: var(--spacing-xl);
  border: 1px solid var(--border-color);
  transition: all var(--transition-speed) ease;
  transform: ${props => props.isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)'};
  animation-fill-mode: both;
  
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--background-color);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: var(--text-color);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const SettingsSection = styled.div`
  margin-bottom: var(--spacing-xl);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
  color: var(--text-color);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: var(--spacing-sm);
    width: 20px;
    height: 20px;
  }
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
`;

const SettingLabel = styled.label`
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  font-weight: 500;
`;

const SettingDescription = styled.span`
  font-size: 0.9em;
  opacity: 0.8;
  margin-top: 2px;
`;

const OptionGroup = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const OptionButton = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--background-color)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 25px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const Switch = styled.div`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: var(--primary-color);
  }
  
  &:checked + span:before {
    transform: translateX(24px);
  }
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-color);
  transition: 0.4s;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const ColorPicker = styled.input`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 50%;
  }
`;

const ResetButton = styled.button`
  background-color: var(--background-color);
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all 0.2s;
  margin-top: var(--spacing-lg);
  
  &:hover {
    background-color: var(--danger-color);
    color: white;
  }
`;

// Icons
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AppearanceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const TextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
  </svg>
);

const AccessibilityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const AdvancedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

// Commented out to fix unused variable warning
// const WordCountDisplay = styled.div`
//   background-color: var(--background-color);
//   border-radius: var(--border-radius-sm);
//   padding: var(--spacing-sm) var(--spacing-md);
//   display: inline-flex;
//   align-items: center;
//   margin-top: var(--spacing-sm);
//   font-size: 0.9em;
//   color: var(--text-secondary);
//   
//   span {
//     font-weight: 600;
//     margin-left: 4px;
//     color: var(--text-color);
//   }
// `;

const Settings = () => {
  const { 
    settings, 
    updateSettings, 
    isSettingsOpen, 
    toggleSettings, 
    resetSettings
  } = useSettings();
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      toggleSettings();
    }
  };
  
  return (
    <>
      <SettingsButton onClick={toggleSettings} aria-label="Settings">
        <SettingsIcon />
      </SettingsButton>
      
      <SettingsModal isOpen={isSettingsOpen} onClick={handleOverlayClick}>
        <ModalContent isOpen={isSettingsOpen}>
          <ModalHeader>
            <ModalTitle>Settings</ModalTitle>
            <CloseButton onClick={toggleSettings}>&times;</CloseButton>
          </ModalHeader>
          
          <SettingsSection>
            <SectionTitle><AppearanceIcon /> Appearance</SectionTitle>
            
            <SettingRow>
              <SettingLabel>
                Theme
                <SettingDescription>Choose your preferred theme</SettingDescription>
              </SettingLabel>
              <OptionGroup>
                <OptionButton 
                  active={settings.theme === 'light'} 
                  onClick={() => updateSettings({ theme: 'light' })}
                >
                  Light
                </OptionButton>
                <OptionButton 
                  active={settings.theme === 'dark'} 
                  onClick={() => updateSettings({ theme: 'dark' })}
                >
                  Dark
                </OptionButton>
                <OptionButton 
                  active={settings.theme === 'system'} 
                  onClick={() => updateSettings({ theme: 'system' })}
                >
                  System
                </OptionButton>
              </OptionGroup>
            </SettingRow>
            
            <SettingRow>
              <SettingLabel>
                Accent Color
                <SettingDescription>Choose your primary UI color</SettingDescription>
              </SettingLabel>
              <ColorPicker 
                type="color" 
                value={settings.customAccentColor} 
                onChange={(e) => updateSettings({ customAccentColor: e.target.value })}
              />
            </SettingRow>
          </SettingsSection>
          
          <SettingsSection>
            <SectionTitle><TextIcon /> Text Size</SectionTitle>
            
            <SettingRow>
              <SettingLabel>
                Text Size
                <SettingDescription>Adjust the size of text throughout the app</SettingDescription>
              </SettingLabel>
              <OptionGroup>
                <OptionButton 
                  active={settings.textSize === 'small'} 
                  onClick={() => updateSettings({ textSize: 'small' })}
                >
                  Small
                </OptionButton>
                <OptionButton 
                  active={settings.textSize === 'medium'} 
                  onClick={() => updateSettings({ textSize: 'medium' })}
                >
                  Medium
                </OptionButton>
                <OptionButton 
                  active={settings.textSize === 'large'} 
                  onClick={() => updateSettings({ textSize: 'large' })}
                >
                  Large
                </OptionButton>
                <OptionButton 
                  active={settings.textSize === 'xl'} 
                  onClick={() => updateSettings({ textSize: 'xl' })}
                >
                  XL
                </OptionButton>
              </OptionGroup>
            </SettingRow>
            
            <SettingRow>
              <SettingLabel>
                UI Scale
                <SettingDescription>Adjust the size of UI elements</SettingDescription>
              </SettingLabel>
              <OptionGroup>
                <OptionButton 
                  active={settings.uiScale === 'small'} 
                  onClick={() => updateSettings({ uiScale: 'small' })}
                >
                  Compact
                </OptionButton>
                <OptionButton 
                  active={settings.uiScale === 'medium'} 
                  onClick={() => updateSettings({ uiScale: 'medium' })}
                >
                  Normal
                </OptionButton>
                <OptionButton 
                  active={settings.uiScale === 'large'} 
                  onClick={() => updateSettings({ uiScale: 'large' })}
                >
                  Large
                </OptionButton>
              </OptionGroup>
            </SettingRow>
          </SettingsSection>
          
          <SettingsSection>
            <SectionTitle><AccessibilityIcon /> Accessibility</SectionTitle>
            
            <SettingRow>
              <SettingLabel>
                High Contrast
                <SettingDescription>Increase contrast for better readability</SettingDescription>
              </SettingLabel>
              <Switch>
                <SwitchInput 
                  type="checkbox" 
                  checked={settings.highContrast} 
                  onChange={() => updateSettings({ highContrast: !settings.highContrast })}
                />
                <SwitchSlider />
              </Switch>
            </SettingRow>
            
            <SettingRow>
              <SettingLabel>
                Reduce Motion
                <SettingDescription>Minimize animations throughout the app</SettingDescription>
              </SettingLabel>
              <Switch>
                <SwitchInput 
                  type="checkbox" 
                  checked={settings.reduceMotion} 
                  onChange={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
                />
                <SwitchSlider />
              </Switch>
            </SettingRow>
          </SettingsSection>
          
          <SettingsSection>
            <SectionTitle><AdvancedIcon /> Content</SectionTitle>
            
            <SettingRow>
              <SettingLabel>
                Word Count
                <SettingDescription>Show word count for content</SettingDescription>
              </SettingLabel>
              <Switch>
                <SwitchInput 
                  type="checkbox" 
                  checked={settings.enableWordCount} 
                  onChange={() => updateSettings({ enableWordCount: !settings.enableWordCount })}
                />
                <SwitchSlider />
              </Switch>
            </SettingRow>
          </SettingsSection>
          
          <ResetButton onClick={resetSettings}>
            Reset to Default Settings
          </ResetButton>
        </ModalContent>
      </SettingsModal>
    </>
  );
};

export default Settings;