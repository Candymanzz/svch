import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    Container,
    Typography,
    Grid,
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    IconButton,
    useTheme,
    useMediaQuery,
    Breadcrumbs,
    Link,
    Snackbar,
    Alert,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: theme.shadows[8],
    },
}));

const ContactIcon = styled(Box)(({ theme }) => ({
    width: 60,
    height: 60,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
    "& svg": {
        fontSize: 30,
        color: "white",
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        "&:hover fieldset": {
            borderColor: theme.palette.primary.main,
        },
    },
}));

const Contact = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the form data to your backend
        console.log("Form submitted:", formData);
        setSnackbar({
            open: true,
            message: "Message sent successfully! We'll get back to you soon.",
            severity: "success",
        });
        setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const contactInfo = [
        {
            title: "Phone",
            content: "+1 (555) 123-4567",
            icon: <PhoneIcon />,
        },
        {
            title: "Email",
            content: "contact@optic.com",
            icon: <EmailIcon />,
        },
        {
            title: "Address",
            content: "123 Optical Street, New York, NY 10001",
            icon: <LocationOnIcon />,
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box sx={{ mb: 6 }}>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                    sx={{ mb: 4 }}
                >
                    <Link
                        underline="hover"
                        color="inherit"
                        component={RouterLink}
                        to="/"
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Home
                    </Link>
                    <Typography color="text.primary">Contact Us</Typography>
                </Breadcrumbs>

                <Box className="contact-description">
                    <Typography variant="h4" component="h1" gutterBottom>
                        Get in Touch
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Have questions about our products or services? We're here to help. Send
                        us a message and we'll respond as soon as possible.
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <StyledTextField
                                            fullWidth
                                            label="Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <StyledTextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <StyledTextField
                                            fullWidth
                                            label="Subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <StyledTextField
                                            fullWidth
                                            label="Message"
                                            name="message"
                                            multiline
                                            rows={4}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            endIcon={<SendIcon />}
                                            sx={{
                                                borderRadius: "25px",
                                                px: 4,
                                                py: 1,
                                                textTransform: "none",
                                                transition: "all 0.3s ease-in-out",
                                                "&:hover": {
                                                    transform: "translateY(-2px)",
                                                    boxShadow: 3,
                                                },
                                            }}
                                        >
                                            Send Message
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    {contactInfo.map((info) => (
                        <StyledCard key={info.title} sx={{ mb: 2 }}>
                            <CardContent sx={{ textAlign: "center", p: 3 }}>
                                <ContactIcon>{info.icon}</ContactIcon>
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    sx={{ fontWeight: 600, mb: 1 }}
                                >
                                    {info.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {info.content}
                                </Typography>
                            </CardContent>
                        </StyledCard>
                    ))}
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Contact; 